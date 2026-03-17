import { Request, Response } from 'express';
import { badRequestError, unauthorizedError } from '@talentsync/types';
import { updatePassword } from '../services/updatePassword.service';

export class UpdatePasswordController {
  // update user password
  static async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userInfo || !req.userInfo.sub) throw unauthorizedError('Unauthorized', 'UNAUTHORIZED');
      const userId = req.userInfo.sub;

      if (!req.body) throw badRequestError('Missing body', 'MISSING_BODY');
      if (!req.body.oldPassword || !req.body.newPassword) {
        throw badRequestError('Missing required field', 'MISSING_REQUIRED_FIELD');
      }
      const { oldPassword, newPassword } = req.body;

      const result = await updatePassword({ userId, oldPassword, newPassword });

      res.status(201).json(result);
    } catch (error) {
      throw error;
    }
  }
}
