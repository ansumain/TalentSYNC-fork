import app from './app';
import { config } from './config/env';

import { sequelize } from '@talentsync/config';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    app.listen(config.port, () => {
      console.log(`Auth service running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Unable to connect to Database', error);
    process.exit(1);
  }
};

startServer();
