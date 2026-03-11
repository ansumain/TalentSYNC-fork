import { Request, Response } from 'express';
import { loginUser } from '../services/loginUser.service';
import { cookieOptions } from '../utils/cookieOptions';

export class LoginUserController {
  // Login User
  static async login(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) throw new Error('Missing body');
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

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';

      // 400 - Validation errors
      if (
        errorMessage.includes('Missing required field') ||
        errorMessage.includes('Missing body')
      ) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 404 - User not found
      if (errorMessage.includes('User not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 404 - Role issues
      if (
        errorMessage.includes('User has no assigned role') ||
        errorMessage.includes('Role not found')
      ) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 401 - Invalid credentials
      if (errorMessage.includes('Invalid Password')) {
        res.status(401).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
