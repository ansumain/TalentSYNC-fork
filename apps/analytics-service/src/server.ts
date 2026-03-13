import app from './app';
import { config } from './config/env';
import { sequelize } from '@talentsync/config';
import { startAnalyticsRefreshScheduler } from './services/refresh.scheduler';
import { connectRabbitMQ, gracefulShutdown as gracefulRabbitShutdown } from './config/rabbitmq';

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  setTimeout(() => {
    console.error('Forced exit after uncaughtException timeout');
    process.exit(1);
  }, 15000).unref();
});

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await connectRabbitMQ();
    console.log('RabbitMQ connected successfully');

    app.listen(config.port, () => {
      console.log(`Analytics service running on port ${config.port}`);
    });

    startAnalyticsRefreshScheduler();

  } catch (error) {
    console.error('Unable to start Application service:', error);
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