import dotenv from 'dotenv';

dotenv.config();

const requireENV = [
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
];

requireENV.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment: ${key}`);
  }
});

export const config = {
  port: Number(process.env.PORT) || 4001,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',

  dbHost: process.env.DB_HOST as string,
  dbPort: Number(process.env.DB_PORT),
  dbUser: process.env.DB_USER as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,

  emailService: process.env.EMAIL_SERVICE || 'gmail',
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER,

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  environment: (process.env.NODE_ENV as string) || 'development',
};
