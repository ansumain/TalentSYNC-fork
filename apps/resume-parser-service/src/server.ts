import app from './app';
import { config } from './config/env';
import { connectRabbitMQ, gracefulShutdown } from './config/rabbitmq';
import { sequelize, logger } from '@talentsync/config';

process.on('SIGTERM', async () => {
  await gracefulShutdown('SIGTERM');
});

process.on('SIGINT', async () => {
  await gracefulShutdown('SIGINT');
});

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error}`);
  gracefulShutdown('UNCAUGHT_EXCEPTION').finally(() => process.exit(1));
  setTimeout(() => {
    logger.error('Forced exit after uncaughtException timeout');
    process.exit(1);
  }, 15000).unref();
});

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');

    await connectRabbitMQ();
    logger.info('RabbitMQ initialized');

    app.listen(config.port, () => {
      logger.info(`Resume Parser service running on port ${config.port}`);
    });

  } catch (error) {
    logger.error(`Unable to start Resume Parser service: ${error}`);
    process.exit(1);
  }
};

startServer();