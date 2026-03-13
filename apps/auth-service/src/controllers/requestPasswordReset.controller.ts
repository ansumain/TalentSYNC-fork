import { Request, Response } from 'express';
import { requestPasswordReset } from '../services/requestPasswordReset.service';

export class RequestPasswordResetController {
  // Request OTP for Password Reset
  static async requestReset(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.email) throw new Error('Missing required field');
      const { email } = req.body;

      const result = await requestPasswordReset({ email });

      res.status(200).json(result);
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

      // 500 - Internal server error
      if (errorMessage.includes('Failed to send email')) {
        res.status(500).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
