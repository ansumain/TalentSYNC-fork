import { Request, Response } from 'express';
import { isAppError } from '@talentsync/types';
import { refreshToken } from '../services/refreshToken.service';
import { cookieOptions } from '../utils/cookieOptions';

export class RefreshTokenController {
  // get access token from refresh token
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

    } catch (error) {
      if (isAppError(error) && error.statusCode === 401) {
        res.clearCookie('refresh_token', { ...cookieOptions, path: '/api/auth/refresh-token' });
      }
      throw error;
    }
  }
}
