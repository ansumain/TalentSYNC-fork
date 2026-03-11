import { requireEnv, requireEnvNumber, baseDbConfig } from '@talentsync/config';

export const config = {
  ...baseDbConfig,
  port: requireEnvNumber('PORT', 4004),
  accessTokenSecret: requireEnv('ACCESS_TOKEN_SECRET')
};
