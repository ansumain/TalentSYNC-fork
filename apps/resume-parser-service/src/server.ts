import app from './app';
import { config } from './config/env';
import { connectRabbitMQ, gracefulShutdown } from './config/rabbitmq';
import {sequelize} from './config/sequelize';

process.on('SIGTERM', async () => {
  await gracefulShutdown('SIGTERM');
});

process.on('SIGINT', async () => {
  await gracefulShutdown('SIGINT');
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION').finally(() => process.exit(1));
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
    console.log('RabbitMQ initialized');

    app.listen(config.port, () => {
      console.log(`Resume Parser service running on port ${config.port}`);
    });

  } catch (error) {
    console.error('Unable to start Resume Parser service:', error);
    process.exit(1);
  }
};

startServer();