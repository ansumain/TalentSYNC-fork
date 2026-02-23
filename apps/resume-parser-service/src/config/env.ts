import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 4002,
  environment: (process.env.NODE_ENV as string) || 'development',
};
