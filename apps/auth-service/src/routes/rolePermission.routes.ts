import express, { Router } from 'express';
import { authenticationMiddleware, requiredRole } from '@talentsync/auth-middlewares';
import { RolePermissionController } from '../controllers/rolePermission.controller';
const rolePermissionRouter: Router = express.Router();

rolePermissionRouter.post(
  '/assign-permission/:roleId',
  authenticationMiddleware,
  requiredRole('admin'),
  RolePermissionController.assignPermissionToRole
);
rolePermissionRouter.delete(
  '/revoke-permission/:roleId/:permissionId',
  authenticationMiddleware,
  requiredRole('admin'),
  RolePermissionController.revokePermissionFromRole
);

export default rolePermissionRouter;
