import { Request, Response } from 'express';
import { logoutUser } from '../services/logoutUser.service';

export class LogoutUserController {
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;

      const result = await logoutUser({ userId });

      res.status(200).json({
        message: result.message,
      });
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing required field')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
