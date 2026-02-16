import { Request, Response } from 'express';
import { loginUser } from '../services/loginUser.service';

export class LoginUserController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const tokens = await loginUser({ email, password });

      res.status(200).json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing required field')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 404 - User not found
      if (errorMessage.includes('User not found')) {
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
