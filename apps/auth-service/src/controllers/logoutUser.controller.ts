import { Request, Response } from 'express';
import { unauthorizedError } from '@talentsync/types';
import { logoutUser } from '../services/logoutUser.service';
import { cookieOptions } from '../utils/cookieOptions';

export class LogoutUserController {
  // Logout User
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userInfo || !req.userInfo.sub) throw unauthorizedError('Unauthorized', 'UNAUTHORIZED');

      const userId = req.userInfo.sub;

      const result = await logoutUser({ userId });

      res.clearCookie('access_token', {
        ...cookieOptions,
      });
      res.clearCookie('refresh_token', {
        ...cookieOptions,
        path: '/auth/refresh-token',
      });

      res.status(200).json({
        message: result.message,
      });
    } catch (error) {
      throw error;
    }
  }
}
