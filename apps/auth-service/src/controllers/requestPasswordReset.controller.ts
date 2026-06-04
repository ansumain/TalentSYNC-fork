import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { requestPasswordReset } from '../services/requestPasswordReset.service';

export class RequestPasswordResetController {
  // Request OTP for Password Reset
  static async requestReset(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || !req.body.email) {
        throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
      }
      const { email } = req.body;

      const result = await requestPasswordReset({ email });

      res.status(200).json(result);
    } catch (error){
      throw error;
    }
  }
}
