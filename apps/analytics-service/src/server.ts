import app from './app';
import { config } from './config/env';
import { sequelize } from '@talentsync/config';

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

    app.listen(config.port, () => {
      console.log(`Analytics service running on port ${config.port}`);
    });

  } catch (error) {
    console.error('Unable to start Application service:', error);
    process.exit(1);
  }
};

startServer();