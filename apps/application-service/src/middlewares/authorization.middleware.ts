import { NextFunction, Request, Response } from 'express';

// check if the user has the required role
const requiredRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.userInfo.role && req.userInfo.role.name === role) {
        return next();
      }

      return res.status(403).json({ error: `${role} role required` });
    } catch (error) {
      next(error);
    }
  };
};

// check if the user has any role from an array of roles
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

export { requiredRole, requiredAnyRole };
