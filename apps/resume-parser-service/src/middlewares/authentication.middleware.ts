import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserInfo } from '@talentsync/types';

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('auth middleware : 111111111111111111');
    // if (req.method === 'OPTIONS') return next();

    console.log('Raw Cookie Header:', req.headers.cookie);
    console.log('Parsed Cookies:', req.cookies);
    // const token = req.cookies.access_token;

    const token = req.cookies.access_token;
    console.log('auth token: 2222222222222', token);
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
      });
    }
    console.log('token present : 33333333333333', token);

    const decodedToken = jwt.verify(token, config.accessTokenSecret) as UserInfo;
    console.log('token decoded : 44444444444444', token);
    req.userInfo = decodedToken ;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired access token' });
  }
};

export { authenticationMiddleware };
