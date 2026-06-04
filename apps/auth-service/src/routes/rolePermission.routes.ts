import express, { Router } from 'express';
import { authenticationMiddleware, requiredRole } from '@talentsync/auth-middlewares';
import { RolePermissionController } from '../controllers/rolePermission.controller';
import { validateRequest } from '@talentsync/validation-middleware';
import { assignPermissionBodySchema, uuidParamSchema } from '../validations/request.validation';
const rolePermissionRouter: Router = express.Router();

rolePermissionRouter.post(
  '/assign-permission/:roleId',
  authenticationMiddleware,
  requiredRole('admin'),
  validateRequest({ params: uuidParamSchema('roleId'), body: assignPermissionBodySchema }),
  RolePermissionController.assignPermissionToRole
);
rolePermissionRouter.delete(
  '/revoke-permission/:roleId/:permissionId',
  authenticationMiddleware,
  requiredRole('admin'),
  validateRequest({ params: uuidParamSchema('roleId').and(uuidParamSchema('permissionId')) }),
  RolePermissionController.revokePermissionFromRole
);

export default rolePermissionRouter;
