import { NextFunction, Request, Response } from 'express';
import { forbiddenError } from '@talentsync/types';
import { getUserPermissions } from '../services/rbac.service';

// check if the user has the required permission
const requiredPermission = (permission: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userPermissions = await getUserPermissions(req.userInfo!.sub!);
      if (userPermissions.includes(permission)) return next();

      return next(forbiddenError('Unauthorized', 'PERMISSION_DENIED'));
    } catch (error) {
      next(error);
    }
  };
};

// check if the user has the required role
const requiredRole = (role: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Check role directly from JWT - no database call needed
      if (req.userInfo!.role && req.userInfo!.role.name === role) {
        return next();
      }

      return next(forbiddenError(`${role} role required`, 'ROLE_REQUIRED'));
    } catch (error) {
      next(error);
    }
  };
};

// check if the user has any role from an array of roles
const requiredAnyRole = () => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Check if user has a role in JWT - no database call needed
      if (req.userInfo!.role && req.userInfo!.role.name) {
        return next();
      }

      return next(forbiddenError('Unauthorized', 'ROLE_REQUIRED'));
    } catch (error) {
      next(error);
    }
  };
};

// check if the user has any permissions from an array of permissions
const requiredAnyPermission = (permissions: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userPermissions = await getUserPermissions(req.userInfo!.sub!);
      const hasAny = permissions.some((permission) => userPermissions.includes(permission));

      if (hasAny) return next();

      return next(forbiddenError('Unauthorized', 'PERMISSION_DENIED'));
    } catch (error) {
      next(error);
    }
  };
};

// check if the user has all permissions from an array of permissions
const requiredAllPermission = (permissions: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userPermissions = await getUserPermissions(req.userInfo!.sub!);
      const hasAll = permissions.every((permission) => userPermissions.includes(permission));

      if (hasAll) return next();

      return next(forbiddenError('Unauthorized', 'PERMISSION_DENIED'));
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
