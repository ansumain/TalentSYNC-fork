import { Request, Response } from 'express';
import { updateUserProfile } from '../services/updateUserProfile.service';
import { UpdateUserProfileInput } from '../types/UpdateUserProfileInput';

export class UpdateUserProfileController {
  static async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userInfo || !req.userInfo.sub) throw new Error('Unauthorized');
      const userId = req.userInfo.sub;

      if (!req.body) throw new Error('Missing body');
      const { name, email, phone } = req.body;

      const toUpdate: Partial<UpdateUserProfileInput> = {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
      };

      const updated = await updateUserProfile({ userId, ...toUpdate });

      res.status(200).json({ ...updated });

      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (errorMessage.includes('Missing body')) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 401 - Unauthenticated user
      if (errorMessage.includes('Unauthorized')) {
        res.status(401).json({ error: errorMessage });
        return;
      }

      // 409 - Conflict (duplicate email/phone)
      if (errorMessage.includes('Email exists') || errorMessage.includes('Phone exists')) {
        res.status(409).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
