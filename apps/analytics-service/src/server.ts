import app from './app';
import { config } from './config/env';
import { sequelize } from '@talentsync/config';
import { startAnalyticsRefreshScheduler } from './services/refresh.scheduler';
import { connectRabbitMQ, gracefulShutdown as gracefulRabbitShutdown } from './config/rabbitmq';
import { logger } from '@talentsync/config';

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error}`);
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
    logger.info('RabbitMQ connected successfully');

    app.listen(config.port, () => {
      logger.info(`Analytics service running on port ${config.port}`);
    });

    startAnalyticsRefreshScheduler();

  } catch (error) {
    logger.error(`Unable to start Application service: ${error}`);
    process.exit(1);
  }
};

startServer();

const shutdown = async () => {
  try {
    await gracefulRabbitShutdown();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);