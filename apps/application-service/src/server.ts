import app from './app';
import { config } from './config/env';
import { sequelize, logger } from '@talentsync/config';

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

    app.listen(config.port, () => {
      logger.info(`Application service running on port ${config.port}`);
    });

  } catch (error) {
    logger.error(`Unable to start Application service: ${error}`);
    process.exit(1);
  }
};

startServer();