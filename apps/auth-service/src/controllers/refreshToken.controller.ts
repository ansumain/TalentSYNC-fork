import { Request, Response } from 'express';
import { refreshToken } from '../services/refreshToken.service';
import { cookieOptions } from '../utils/cookieOptions';

export class RefreshTokenController {
  static async getAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.refresh_token;

      const result = await refreshToken({ token });

      res.cookie('access_token', result.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({
        message: 'Access Token Renewed Successfully!',
      });

      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing required field')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 401 - Invalid/expired/revoked token
      if (
        errorMessage.includes('Invalid token') ||
        errorMessage.includes('Invalid or expired refresh token')
      ) {
        res.clearCookie('refresh_token', { ...cookieOptions, path: '/auth/refresh-token' });
        res.status(401).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
