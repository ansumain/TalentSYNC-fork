import { config } from '../config/env';

// cookie options for access_token and refresh_token
export const cookieOptions = {
  httpOnly: true,
  secure: config.environment === 'production',
};
