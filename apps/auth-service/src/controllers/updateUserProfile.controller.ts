import { Request, Response } from 'express';
import { badRequestError, unauthorizedError } from '@talentsync/types';
import { updateUserProfile } from '../services/updateUserProfile.service';
import { UpdateUserProfileInput } from '../types/UpdateUserProfileInput';

export class UpdateUserProfileController {
  // update user profile
  static async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userInfo || !req.userInfo.sub) throw unauthorizedError('Unauthorized', 'UNAUTHORIZED');
      const userId = req.userInfo.sub;

      if (!req.body) throw badRequestError('Missing body', 'MISSING_BODY');
      const { name, email, phone } = req.body;

      const toUpdate: Partial<UpdateUserProfileInput> = {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
      };

      const updated = await updateUserProfile({ userId, ...toUpdate });

      res.status(200).json({ ...updated });
    } catch (error) {
      throw error;
    }
  }
}
