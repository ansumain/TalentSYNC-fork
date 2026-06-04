import dotenv from 'dotenv';
import { resolve } from 'path';

// Load root .env first (shared variables)
dotenv.config({ path: resolve(process.cwd(), '../../.env') });
// Load service-specific .env (overrides root if needed)
dotenv.config({ path: resolve(process.cwd(), '.env') });

export const requireEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const requireEnvNumber = (key: string, fallback?: number): number => {
  const raw = process.env[key];
  if (!raw) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const parsed = Number(raw);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, got "${raw}"`);
  }
  return parsed;
};

export const baseDbConfig = {
  dbHost: requireEnv('DB_HOST', 'localhost'),
  dbPort: requireEnvNumber('DB_PORT', 5432),
  dbUser: requireEnv('DB_USER', 'rms_user'),
  dbPassword: requireEnv('DB_PASSWORD', 'rms_password'),
  dbName: requireEnv('DB_NAME', 'rms_db'),
  environment: (process.env.NODE_ENV as string) || 'development',
};
