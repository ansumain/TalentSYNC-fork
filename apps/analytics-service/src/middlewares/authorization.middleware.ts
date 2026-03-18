import { NextFunction, Request, Response } from 'express';
import { forbiddenError } from '@talentsync/types';

const requiredAnyRole = (roles: string[]) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (req.userInfo.role && req.userInfo.role.name && roles.includes(req.userInfo.role.name)) {
                return next();
            }

            return next(forbiddenError('Unauthorized - required roles: ' + roles.join(', '), 'ROLE_REQUIRED'));
        } catch (error) {
            next(error);
        }
    };
};

export { requiredAnyRole };