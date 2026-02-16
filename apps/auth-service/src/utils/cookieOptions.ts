import { config } from '../config/env';

export const cookieOptions = {
  httpOnly: true,
  secure: config.environment === 'production',
};
