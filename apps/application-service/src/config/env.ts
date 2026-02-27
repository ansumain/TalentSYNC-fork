import dotenv from 'dotenv';
dotenv.config();

const requireEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const requireEnvNumber = (key: string, fallback?: number): number => {
  const raw = process.env[key];
  if (!raw) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const parsed = Number(raw);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, "${raw}"`);
  }
  return parsed;
}

export const config = {
  port: requireEnvNumber('PORT', 4003),
  environment: (process.env.NODE_ENV as string) || 'development',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,

  dbHost: requireEnv('DB_HOST', 'localhost'),
  dbUser: requireEnv('DB_USER', 'rms_user'),
  dbPassword: requireEnv('DB_PASSWORD', 'rms_password'),
  dbName: requireEnv('DB_NAME', 'rms_db'),
  dbPort: requireEnvNumber('DB_PORT', 5432)
};