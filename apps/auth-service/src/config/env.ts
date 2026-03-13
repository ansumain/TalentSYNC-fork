import { requireEnv, requireEnvNumber, baseDbConfig } from '@talentsync/config';

export const config = {
  ...baseDbConfig,
  port: requireEnvNumber('PORT', 4001),
  accessTokenSecret: requireEnv('ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: requireEnv('REFRESH_TOKEN_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',

  emailService: process.env.EMAIL_SERVICE || 'gmail',
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER,

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
