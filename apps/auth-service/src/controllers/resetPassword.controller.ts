import { Request, Response } from 'express';
import { resetPassword } from '../services/resetPassword.service';

export class ResetPasswordController {
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.email || !req.body.otp || !req.body.newPassword)
        throw new Error('Missing required field');
      const { email, otp, newPassword } = req.body;

      const result = await resetPassword({ email, otp, newPassword });

      res.status(200).json(result);
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (
        errorMessage.includes('Missing required field') ||
        errorMessage.includes('Missing body') ||
        errorMessage.includes('Weak password')
      ) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 404 - User not found
      if (errorMessage.includes('User not found')) {
        res.status(404).json({ error: errorMessage });
        return;
      }

      // 401 - Invalid/expired OTP
      if (errorMessage.includes('Invalid or expired OTP')) {
        res.status(401).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
