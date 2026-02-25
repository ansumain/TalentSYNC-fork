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
  port: requireEnvNumber('PORT', 4002),
  environment: (process.env.NODE_ENV as string) || 'development',


  dbHost: requireEnv('DB_HOST', 'localhost'),
  dbUser: requireEnv('DB_USER', 'rms_user'),
  dbPassword: requireEnv('DB_PASSWORD', 'rms_password'),
  dbName: requireEnv('DB_NAME', 'rms_db'),
  dbPort: requireEnvNumber('DB_PORT', 5432),

  rabbitmq: {
    hostname: requireEnv('RABBIT_MQ_HOST', 'localhost'),
    port: requireEnvNumber('RABBIT_MQ_PORT', 5672),
    username: requireEnv('RABBIT_MQ_USER', 'admin'),
    password: requireEnv('RABBIT_MQ_PASSWORD', 'password'),
    heartbeat: requireEnvNumber('RABBIT_MQ_HEARTBEAT', 60),

    reconnect: {
      maxAttempts: requireEnvNumber('RABBIT_MQ_MAX_RECONNECT', 10),
      initialDelay: requireEnvNumber('RABBIT_MQ_RECONNECT_DELAY', 5000),
    },
  },

  queues: {
    resumeParse: requireEnv('QUEUE_RESUME_PARSE', 'resume.parse'),
    resumeRetry: requireEnv('QUEUE_RESUME_RETRY', 'resume.parse.retry'),
    resumeFailed: requireEnv('QUEUE_RESUME_FAILED', 'resume.failed'),

    maxRetries: requireEnvNumber('QUEUE_MAX_RETRIES', 3),
    retryDelay: requireEnvNumber('QUEUE_RETRY_DELAY', 5000),
    prefetch: requireEnvNumber('QUEUE_PREFETCH', 10),
  },
};