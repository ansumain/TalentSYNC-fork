import amqp, { ChannelModel } from 'amqplib';
import { config } from './env';

type Channel = amqp.Channel;

let connection: ChannelModel | null = null;
let publishChannel: Channel | null = null;
let consumeChannel: Channel | null = null;

let reconnectAttempts = 0;
let isConnecting = false;
let isShuttingDown = false;
let inFlightMessages = 0;

// Queue names
const RESUME_PARSE_QUEUE = config.queues.resumeParse;   // resume.parse
const RESUME_RETRY_QUEUE = config.queues.resumeRetry;   // resume.parse.retry
const RESUME_FAILED_QUEUE = config.queues.resumeFailed;  // resume.failed

// Retry configuration
const MAX_RETRIES = config.queues.maxRetries;
const RETRY_DELAY = config.queues.retryDelay;
const DLX_EXCHANGE = 'dlx.resume';
const DLX_ROUTING_RETRY = 'retry';
const DLX_ROUTING_FAILED = 'failed';

const connectRabbitMQ = async (): Promise<void> => {
    if (isConnecting) {
        console.log('Connection already in progress');
        return;
    }
    if (isShuttingDown) {
        console.log('Shutdown in progress');
        return;
    }

    isConnecting = true;

    try {

        connection = await amqp.connect({
            hostname: config.rabbitmq.hostname,
            port: config.rabbitmq.port,
            username: config.rabbitmq.username,
            password: config.rabbitmq.password
        });

        // Publish channel
        publishChannel = (await connection.createChannel()) as Channel;
        publishChannel.on('error', (e: Error) => console.error('Publish channel error:', e.message));
        publishChannel.on('close', () => console.warn('Publish channel closed'));

        // Consume channel — with prefetch limit
        consumeChannel = (await connection.createChannel()) as Channel;
        consumeChannel.on('error', (e: Error) => console.error('Consume channel error:', e.message));
        consumeChannel.on('close', () => console.warn('Consume channel closed'));
        await consumeChannel.prefetch(config.queues.prefetch);

        await setupQueues();

        reconnectAttempts = 0;
        isConnecting = false;

        connection.on('error', handleConnectionError);
        connection.on('close', handleConnectionClose);

    } catch (error) {
        isConnecting = false;
        connection = null;
        publishChannel = null;
        consumeChannel = null;
        console.error('Failed to connect to RabbitMQ:', error);
        await attemptReconnect();
        throw error;
    }
}

const publishToQueue = async (
    queue: string,
    message: any,
    retryCount: number = 0,
): Promise<void> => {
    if (!publishChannel) {
        throw new Error('Publish channel not initialized. Call connectRabbitMQ() first.');
    }

    const headers: Record<string, any> = { 'x-retry-count': retryCount };
    if (retryCount === 0) headers['x-first-published'] = Date.now();

    publishChannel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true, headers }
    );

    console.log(`Published to ${queue}:`, { message, retryCount });
}

const consumeQueue = async (
    queue: string,
    handler: (content: any) => Promise<void>,
): Promise<void> => {
    console.log('consumption initiated')
    if (!consumeChannel) {
        throw new Error('Consume channel not initialized. Call connectRabbitMQ() first.');
    }

    console.log('consumption started')

    const channel = consumeChannel as Channel;

    await channel.consume(
        queue,
        async (message) => {
            if (!message) {
                console.warn('Received null message');
                return;
            }

            if (isShuttingDown) {
                console.log('Shutdown in progress');
                channel.nack(message, false, true);
                return;
            }

            inFlightMessages++;

            let content: any;
            let rawMessage: string = '';
            let retryCount: number = 0;

            try {
                rawMessage = message.content.toString();
                content = JSON.parse(rawMessage);
                retryCount = message.properties.headers?.['x-retry-count'] as number || 0;

                await handler(content);

                channel.ack(message);

            } catch (e: any) {
                console.error('Message processing failed:', {
                    messageId: content?.id || 'unknown',
                    retryCount,
                    error: e.message,
                    rawMessage: rawMessage || 'No raw message '
                });

                if (retryCount >= MAX_RETRIES) {
                    try {
                        await publishToQueue(RESUME_FAILED_QUEUE, {
                            ...content,
                            error: {
                                message: e.message,
                                stack: e.stack,
                                finalRetryCount: retryCount,
                                failedAt: new Date().toISOString(),
                            },
                        });
                        channel.ack(message);
                    } catch (publishError) {
                        console.error('Failed to publish to failed_queue:', publishError);
                        channel.nack(message, false, false);
                    }

                } else {
                    const nextRetryCount = retryCount + 1;

                    try {
                        await publishToQueue(RESUME_RETRY_QUEUE, content, nextRetryCount);
                        channel.ack(message);
                    } catch (publishError) {
                        console.error('Failed to publish to retry queue:', publishError);
                        channel.nack(message, false, true);
                    }
                }

            } finally {
                inFlightMessages--;
            }
        },
        {
            noAck: false,
            consumerTag: `consumer-${queue}-${Date.now()}`,
        },
    );
}

const gracefulShutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
        console.log('Shutdown already in progress');
        return;
    }

    isShuttingDown = true;
    console.log(`\n${signal} received. Starting graceful shutdown`);

    try {
        const maxWaitTime = 10000;
        const startTime = Date.now();

        while (inFlightMessages > 0 && Date.now() - startTime < maxWaitTime) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (inFlightMessages > 0) {
            console.warn(`Timeout: ${inFlightMessages} messages still in-flight. Forcing shutdown.`);
        } else {
            console.log('All in-flight messages processed');
        }

        if (consumeChannel) {
            await consumeChannel.close();
            consumeChannel = null;
            console.log('Consume channel closed');
        }

        if (publishChannel) {
            await publishChannel.close();
            publishChannel = null;
            console.log('Publish channel closed');
        }

        if (connection) {
            await connection.close();
            connection = null;
            console.log('RabbitMQ connection closed');
        }

        console.log('Graceful shutdown complete');
        process.exit(0);

    } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
}

const setupQueues = async (): Promise<void> => {
    if (!publishChannel) throw new Error('Publish channel not initialized');

    await publishChannel.assertExchange(DLX_EXCHANGE, 'direct', { durable: true });

    await publishChannel.assertQueue(RESUME_FAILED_QUEUE, { durable: true });
    await publishChannel.bindQueue(RESUME_FAILED_QUEUE, DLX_EXCHANGE, DLX_ROUTING_FAILED);

    await publishChannel.assertQueue(RESUME_RETRY_QUEUE, {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: RESUME_PARSE_QUEUE,
        messageTtl: RETRY_DELAY,
    });
    await publishChannel.bindQueue(RESUME_RETRY_QUEUE, DLX_EXCHANGE, DLX_ROUTING_RETRY);

    await publishChannel.assertQueue(RESUME_PARSE_QUEUE, {
        durable: true,
        deadLetterExchange: DLX_EXCHANGE,
        deadLetterRoutingKey: DLX_ROUTING_RETRY,
    });
}

const attemptReconnect = async (): Promise<void> => {
    if (isShuttingDown) {
        console.log('Shutdown in progress, skipping reconnect');
        return;
    }
    if (reconnectAttempts >= config.rabbitmq.reconnect.maxAttempts) {
        console.error(`Max reconnection attempts reached. Exiting`);
        process.exit(1);
    }

    reconnectAttempts++;
    const delay = Math.min(config.rabbitmq.reconnect.initialDelay * Math.pow(2, reconnectAttempts - 1), 60000);

    await new Promise<void>((resolve) => setTimeout(resolve, delay));

    try {
        await connectRabbitMQ();
    } catch (e) {
        console.error('Reconnect attempt failed:', e);
    }
}

const handleConnectionError = (error: Error): void => {
    console.error('RabbitMQ connection error:', error.message);
}

const handleConnectionClose = (): void => {
    if (!isShuttingDown) {
        console.warn('RabbitMQ connection closed unexpectedly. Reconnecting');
        connection = null;
        publishChannel = null;
        consumeChannel = null;
        isConnecting = false;
        attemptReconnect().catch((e) => {
            console.error('Reconnect failed', e);
        });
    }
}

const isConnected = (): boolean => {
    return connection !== null && publishChannel !== null && consumeChannel !== null;
}

const getInFlightCount = (): number => {
    return inFlightMessages;
}

export {
    connectRabbitMQ,
    publishToQueue,
    consumeQueue,
    gracefulShutdown,
    isConnected,
    getInFlightCount
}