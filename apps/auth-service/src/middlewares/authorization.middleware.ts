import { NextFunction, Request, Response } from 'express';
import { getUserPermissions } from '../services/rbac.service';

const requiredPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPermissions = await getUserPermissions(req.userInfo.sub);
      if (userPermissions.includes(permission)) return next();

      return res.status(403).json({ error: 'Unauthorized' });
    } catch (error) {
      next(error);
    }
  };
};

const requiredRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check role directly from JWT - no database call needed
      if (req.userInfo.role && req.userInfo.role.name === role) {
        return next();
      }

      return res.status(403).json({ error: `${role} role, required` });
    } catch (error) {
      next(error);
    }
  };
};

const requiredAnyRole = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user has a role in JWT - no database call needed
      if (req.userInfo.role && req.userInfo.role.name) {
        return next();
      }

      return res.status(403).json({ error: 'Unauthorized' });
    } catch (error) {
      next(error);
    }
  };
};

const requiredAnyPermission = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPermissions = await getUserPermissions(req.userInfo.sub);
      const hasAny = permissions.some((permission) => userPermissions.includes(permission));

      if (hasAny) return next();

      return res.status(403).json({ error: 'Unauthorized' });
    } catch (error) {
      next(error);
    }
  };
};

const requiredAllPermission = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPermissions = await getUserPermissions(req.userInfo.sub);
      const hasAll = permissions.every((permission) => userPermissions.includes(permission));

      if (hasAll) return next();

      return res.status(403).json({ error: 'Unauthorized' });
    } catch (error) {
      next(error);
    }
  };
};

export {
  requiredPermission,
  requiredRole,
  requiredAnyRole,
  requiredAnyPermission,
  requiredAllPermission,
};
