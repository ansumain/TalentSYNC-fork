import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { loginUser } from '../services/loginUser.service';
import { cookieOptions } from '../utils/cookieOptions';

export class LoginUserController {
  // Login User
  static async login(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) throw badRequestError('Missing body', 'MISSING_BODY');
      const { email, password } = req.body;

      const tokens = await loginUser({ email, password });

      res.cookie('access_token', tokens.accessToken, {
        ...cookieOptions,
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refresh_token', tokens.refreshToken, {
        ...cookieOptions,
        path: '/auth/refresh-token',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: 'Login Successful',
      });
    } catch (error) {
      throw error;
    }
  }
}
