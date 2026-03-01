import { requireEnv, requireEnvNumber, baseDbConfig } from '@talentsync/config';

export const config = {
  ...baseDbConfig,
  port: requireEnvNumber('PORT', 4003),
  accessTokenSecret: requireEnv('ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: requireEnv('REFRESH_TOKEN_SECRET'),
};
