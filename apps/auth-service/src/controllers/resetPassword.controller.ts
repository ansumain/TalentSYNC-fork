import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { resetPassword } from '../services/resetPassword.service';

export class ResetPasswordController {
  // Reset Password using the received OTP via mail
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.email || !req.body.otp || !req.body.newPassword) {
        throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
      }
      const { email, otp, newPassword } = req.body;

      const result = await resetPassword({ email, otp, newPassword });

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }
}
