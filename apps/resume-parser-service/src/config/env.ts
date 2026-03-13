import { requireEnv, requireEnvNumber, baseDbConfig } from '@talentsync/config';

export const config = {
  ...baseDbConfig,
  port: requireEnvNumber('PORT', 4002),
  accessTokenSecret: requireEnv('ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: requireEnv('REFRESH_TOKEN_SECRET'),

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
    retry: requireEnvNumber('RETRY_ATTEMPTS', 3),

    resumeParse: requireEnv('QUEUE_RESUME_PARSE', 'resume.parse'),
    resumeRetry: requireEnv('QUEUE_RESUME_RETRY', 'resume.parse.retry'),
    resumeFailed: requireEnv('QUEUE_RESUME_FAILED', 'resume.failed'),

    maxRetries: requireEnvNumber('QUEUE_MAX_RETRIES', 3),
    retryDelay: requireEnvNumber('QUEUE_RETRY_DELAY', 5000),
    prefetch: requireEnvNumber('QUEUE_PREFETCH', 10),
  },

  emailService: process.env.EMAIL_SERVICE || 'gmail',
  emailUser: process.env.EMAIL_USER || 'mfsi.ansuman@gmail.com',
  emailPassword: process.env.EMAIL_PASSWORD || 'uqvt jjlk djxl pqtq',
  emailFrom: process.env.EMAIL_FROM || 'TalentSYNC <mfsi.ansuman@gmail.com>',
};
