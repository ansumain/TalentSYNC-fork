import { NextFunction, Request, Response } from 'express';

const requiredAnyRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.userInfo.role && req.userInfo.role.name && roles.includes(req.userInfo.role.name)) {
                return next();
            }

            return res.status(403).json({ error: 'Unauthorized - required roles: ' + roles.join(', ') });
        } catch (error) {
            next(error);
        }
    };
};

export { requiredAnyRole };