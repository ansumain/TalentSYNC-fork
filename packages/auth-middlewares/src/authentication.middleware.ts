import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// import { config } from '../config/env';
import { unauthorizedError, forbiddenError, UserInfo } from '@talentsync/types';

// check if the user is logged in
const authenticationMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      next(unauthorizedError('Access denied. No token provided.', 'ACCESS_TOKEN_MISSING'));
      return;
    }

    const decodedToken = jwt.verify(token, (process.env.ACCESS_TOKEN_SECRET as string)) as UserInfo;
    req.userInfo = decodedToken;
    next();
  } catch {
    next(forbiddenError('Invalid or expired access token', 'ACCESS_TOKEN_INVALID'));
  }
};

export { authenticationMiddleware };
