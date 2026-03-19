import app from './app';
import { config } from './config/env';

import { logger, sequelize } from '@talentsync/config';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');

    app.listen(config.port, () => {
      logger.info(`Auth service running on port ${config.port}`);
    });
  } catch (error) {
    logger.error(`Unable to connect to Database: ${error}`);
    process.exit(1);
  }
};

startServer();
