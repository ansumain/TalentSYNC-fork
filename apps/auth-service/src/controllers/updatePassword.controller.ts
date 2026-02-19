import { Request, Response } from 'express';
import { updatePassword } from '../services/updatePassword.service';

export class UpdatePasswordController {
  static async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userInfo || !req.userInfo.sub) throw new Error('Unauthorized');
      const userId = req.userInfo.sub;

      if (!req.body) throw new Error('Missing body');
      if (!req.body.oldPassword || !req.body.newPassword) throw new Error('Missing required field');
      const { oldPassword, newPassword } = req.body;

      const result = await updatePassword({ userId, oldPassword, newPassword });

      res.status(201).json(result);

      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (
        errorMessage.includes('Missing required field') ||
        errorMessage.includes('Missing body')
      ) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 401 - Unauthenticated user
      if (errorMessage.includes('Unauthorized')) {
        res.status(401).json({ error: errorMessage });
        return;
      }
      if (errorMessage.includes('Invalid Password')) {
        res.status(401).json({ error: errorMessage });
        return;
      }

      // 404 - User not found
      if (errorMessage.includes('User not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
