import { NextFunction, Request, Response } from 'express';
import { forbiddenError } from '@talentsync/types';

// check if the user has the required role
const requiredRole = (role: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Check role directly from JWT - no database call needed
      if (req.userInfo.role && req.userInfo.role.name === role) {
        return next();
      }

      return next(forbiddenError(`${role} role required`, 'ROLE_REQUIRED'));
    } catch (error) {
      next(error);
    }
  };
};

// check if the user has any role from an array of roles
const requiredAnyRole = (roles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Check if user has a role in JWT - no database call needed
      if (req.userInfo.role && req.userInfo.role.name && roles.includes(req.userInfo.role.name)) {
        return next();
      }

      return next(forbiddenError('Unauthorized', 'ROLE_REQUIRED'));
    } catch (error) {
      next(error);
    }
  };
};

export { requiredRole, requiredAnyRole };
