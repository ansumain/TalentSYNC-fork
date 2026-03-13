import { Sequelize } from 'sequelize';
import { baseDbConfig } from './env';

export const createSequelizeInstance = (): Sequelize => {
  return new Sequelize(
    baseDbConfig.dbName,
    baseDbConfig.dbUser,
    baseDbConfig.dbPassword,
    {
      host: baseDbConfig.dbHost,
      port: baseDbConfig.dbPort,
      dialect: 'postgres',
      logging: false,
    }
  );
};

export const sequelize = createSequelizeInstance();
