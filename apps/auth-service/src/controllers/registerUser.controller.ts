import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { registerUser } from '../services/registerUser.service';

export class RegisterUserController {
  // register a new user
  static async register(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) throw badRequestError('Missing body', 'MISSING_BODY');
      const { name, email, phone, password } = req.body;

      const user = await registerUser({ name, email, phone, password });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
    catch (error) {
      throw error;
    }
  }
}
