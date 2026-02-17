import { Request, Response } from 'express';
import { userProfile } from '../services/userProfile.service';

export class UserProfileController {
  static async userProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userInfo || !req.userInfo.sub) throw new Error('Unauthorized');

      const userId = req.userInfo.sub;
      const user = await userProfile({ userId });

      res.status(200).json({ data: user });

      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';

      // 401 - Unauthenticated user
      if (errorMessage.includes('Unauthorized')) {
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
