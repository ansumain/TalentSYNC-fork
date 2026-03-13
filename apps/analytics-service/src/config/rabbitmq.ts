import amqp, { ChannelModel } from 'amqplib';
import { config } from './env';

type Channel = amqp.Channel;

let connection: ChannelModel | null = null;
let publishChannel: Channel | null = null;
let consumeChannel: Channel | null = null;
let isConnecting = false;
let isShuttingDown = false;

const EXPORT_QUEUE = config.queues.exportReport;
const EXPORT_RETRY_QUEUE = config.queues.exportRetry;
const EXPORT_FAILED_QUEUE = config.queues.exportFailed;

const MAX_RETRIES = config.queues.maxRetries;
const RETRY_DELAY = config.queues.retryDelay;
const DLX_EXCHANGE = 'dlx.analytics.export';
const DLX_ROUTING_RETRY = 'retry';
const DLX_ROUTING_FAILED = 'failed';

const connectRabbitMQ = async (): Promise<void> => {
  if (isConnecting || isShuttingDown) return;
  if (connection && publishChannel && consumeChannel) return;

  isConnecting = true;
  try {
    connection = await amqp.connect({
      hostname: config.rabbitmq.hostname,
      port: config.rabbitmq.port,
      username: config.rabbitmq.username,
      password: config.rabbitmq.password,
      heartbeat: config.rabbitmq.heartbeat,
    });

    publishChannel = await connection.createChannel();
    consumeChannel = await connection.createChannel();
    await consumeChannel.prefetch(config.queues.prefetch);

    await setupQueues();

    isConnecting = false;
  } catch (error) {
    isConnecting = false;
    connection = null;
    publishChannel = null;
    consumeChannel = null;
    throw error;
  }
};

const setupQueues = async (): Promise<void> => {
  if (!publishChannel) throw new Error('Publish channel not initialized');

  await publishChannel.assertExchange(DLX_EXCHANGE, 'direct', { durable: true });

  await publishChannel.assertQueue(EXPORT_FAILED_QUEUE, { durable: true });
  await publishChannel.bindQueue(EXPORT_FAILED_QUEUE, DLX_EXCHANGE, DLX_ROUTING_FAILED);

  await publishChannel.assertQueue(EXPORT_RETRY_QUEUE, {
    durable: true,
    deadLetterExchange: '',
    deadLetterRoutingKey: EXPORT_QUEUE,
    messageTtl: RETRY_DELAY,
  });
  await publishChannel.bindQueue(EXPORT_RETRY_QUEUE, DLX_EXCHANGE, DLX_ROUTING_RETRY);

  await publishChannel.assertQueue(EXPORT_QUEUE, {
    durable: true,
    deadLetterExchange: DLX_EXCHANGE,
    deadLetterRoutingKey: DLX_ROUTING_RETRY,
  });
};

const publishToQueue = async (queue: string, message: unknown, retryCount: number = 0): Promise<void> => {
  if (!publishChannel) throw new Error('Publish channel not initialized');

  const headers: Record<string, unknown> = { 'x-retry-count': retryCount };
  publishChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
    headers,
  });
};

const consumeQueue = async (
  queue: string,
  handler: (content: any) => Promise<void>
): Promise<void> => {
  if (!consumeChannel) throw new Error('Consume channel not initialized');

  await consumeChannel.consume(
    queue,
    async (message) => {
      if (!message) return;
      const channel = consumeChannel as Channel;

      try {
        const retryCount = Number(message.properties.headers?.['x-retry-count'] ?? 0);
        const content = JSON.parse(message.content.toString());

        await handler(content);
        channel.ack(message);
      } catch (error) {
        const retryCount = Number(message.properties.headers?.['x-retry-count'] ?? 0);

        if (retryCount >= MAX_RETRIES) {
          await publishToQueue(EXPORT_FAILED_QUEUE, {
            payload: message.content.toString(),
            error: error instanceof Error ? error.message : 'unknown',
            failedAt: new Date().toISOString(),
          });
          channel.ack(message);
        } else {
          const nextRetryCount = retryCount + 1;
          const parsed = JSON.parse(message.content.toString());
          await publishToQueue(EXPORT_RETRY_QUEUE, parsed, nextRetryCount);
          channel.ack(message);
        }
      }
    },
    { noAck: false }
  );
};

const gracefulShutdown = async (): Promise<void> => {
  isShuttingDown = true;

  if (consumeChannel) {
    await consumeChannel.close();
    consumeChannel = null;
  }

  if (publishChannel) {
    await publishChannel.close();
    publishChannel = null;
  }

  if (connection) {
    await connection.close();
    connection = null;
  }
};

const isConnected = () => Boolean(connection && publishChannel && consumeChannel);

export { connectRabbitMQ, publishToQueue, consumeQueue, gracefulShutdown, isConnected };
