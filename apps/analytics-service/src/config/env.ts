import { requireEnv, requireEnvNumber, baseDbConfig } from '@talentsync/config';

export const config = {
  ...baseDbConfig,
  port: requireEnvNumber('PORT', 4004),
  accessTokenSecret: requireEnv('ACCESS_TOKEN_SECRET'),

  rabbitmq: {
    hostname: requireEnv('RABBIT_MQ_HOST', 'localhost'),
    port: requireEnvNumber('RABBIT_MQ_PORT', 5672),
    username: requireEnv('RABBIT_MQ_USER', 'admin'),
    password: requireEnv('RABBIT_MQ_PASSWORD', 'password'),
    heartbeat: requireEnvNumber('RABBIT_MQ_HEARTBEAT', 60),
  },

  queues: {
    exportReport: requireEnv('QUEUE_ANALYTICS_EXPORT', 'analytics.export.report'),
    exportRetry: requireEnv('QUEUE_ANALYTICS_EXPORT_RETRY', 'analytics.export.retry'),
    exportFailed: requireEnv('QUEUE_ANALYTICS_EXPORT_FAILED', 'analytics.export.failed'),
    maxRetries: requireEnvNumber('QUEUE_MAX_RETRIES', 3),
    retryDelay: requireEnvNumber('QUEUE_RETRY_DELAY', 5000),
    prefetch: requireEnvNumber('QUEUE_PREFETCH', 10),
  },

  emailService: process.env.EMAIL_SERVICE || 'gmail',
  emailUser: process.env.EMAIL_USER || 'mfsi.ansuman@gmail.com',
  emailPassword: process.env.EMAIL_PASSWORD || 'uqvt jjlk djxl pqtq',
  emailFrom: process.env.EMAIL_FROM || 'TalentSYNC <mfsi.ansuman@gmail.com>',
};
