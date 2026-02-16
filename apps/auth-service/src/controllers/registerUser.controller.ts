import { Request, Response } from 'express';
import { registerUser } from '../services/registerUser.service';

export class RegisterUserController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;

      const user = await registerUser({ name, email, phone, password });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      // Map service errors to HTTP status codes
      const errorMessage = error.message || 'Internal server error';

      // 400 - Validation errors
      if (
        errorMessage.includes('Missing required field') ||
        errorMessage.includes('Name too short') ||
        errorMessage.includes('Name too long') ||
        errorMessage.includes('Weak password')
      ) {
        res.status(400).json({ error: errorMessage });
        return;
      }

      // 409 - Conflict (duplicate email/phone)
      if (errorMessage.includes('Email exists') || errorMessage.includes('Phone exists')) {
        res.status(409).json({ error: errorMessage });
        return;
      }

      // 500 - Unexpected errors
      res.status(500).json({ error: `Internal server error, ${error}` });
    }
  }
}
