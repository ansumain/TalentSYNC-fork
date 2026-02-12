import dotenv from 'dotenv';

dotenv.config();

const requireENV = ['JWT_SECRET', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

requireENV.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment: ${key}`);
  }
});

export const config = {
  port: Number(process.env.PORT) || 4001,
  jwtsecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',

  dbHost: process.env.DB_HOST as string,
  dbPort: Number(process.env.DB_PORT),
  dbUser: process.env.DB_USER as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
};
