import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserInfo } from '@talentsync/types';

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({
                error: 'Access denied. No token provided.',
            });
        }

        const decodedToken = jwt.verify(token, config.accessTokenSecret) as UserInfo;
        req.userInfo = decodedToken;
        next();
    } catch {
        res.status(403).json({ error: 'Invalid or expired access token' });
    }
};

export { authenticationMiddleware };
