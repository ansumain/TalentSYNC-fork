import { NextFunction, Request, Response } from 'express';
import { getUserPermissions, getUserRoles } from '../services/rbac.service';
import { getAllRoles, getRoleById } from '../services/role.service';

const requiredPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPermissions = await getUserPermissions(req.userInfo.sub);
      if (userPermissions.includes(permission)) return next();

      return res.status(401).json({ error: 'Unauthorized' });
    } catch (error) {
      next(error);
    }
  };
};

const requiredRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRoles = await getUserRoles(req.userInfo.sub);
      if (userRoles.includes(role)) {
        next();
      } else {
        res.status(401).json({ error: `${role} role, required` });
      }
    } catch (error) {
      next(error);
    }
  };
};

const requiredAnyRole = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await getAllRoles();
      const userRoles = await getRoleById(req.userInfo.role.name);
      const hasAny = roles.some((role) => userRoles.includes(role));

      if (hasAny) return next();

      return res.status(401).json({ error: 'Unauthorized' });
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

      return res.status(401).json({ error: 'Unauthorized' });
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

      return res.status(401).json({ error: 'Unauthorized' });
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
