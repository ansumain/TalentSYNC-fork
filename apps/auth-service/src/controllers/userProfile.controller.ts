import { Request, Response } from 'express';
import { unauthorizedError } from '@talentsync/types';
import { userProfile } from '../services/userProfile.service';

export class UserProfileController {
  // get user profile
  static async userProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userInfo || !req.userInfo.sub) throw unauthorizedError('Unauthorized', 'UNAUTHORIZED');

      const userId = req.userInfo.sub;
      const user = await userProfile({ userId });

      res.status(200).json({ data: user });
    } catch (error) {
      throw error;
    }
  }
}
