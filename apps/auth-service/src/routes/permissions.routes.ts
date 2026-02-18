import express from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredRole } from '../middlewares/authorization.middleware';
import { PermissionController } from '../controllers/permisison.controller';
const permisisonRouter = express.Router();

permisisonRouter.get(
  '/permissions',
  authenticationMiddleware,
  requiredRole('admin'),
  PermissionController.getAllPermissions
);
permisisonRouter.get(
  '/permission/user/:userId',
  authenticationMiddleware,
  requiredRole('admin'),
  PermissionController.getPermissionByUserId
);
permisisonRouter.get(
  '/permission/role/:roleId',
  authenticationMiddleware,
  requiredRole('admin'),
  PermissionController.getPermissionByRoleId
);
permisisonRouter.post(
  '/permission',
  authenticationMiddleware,
  requiredRole('admin'),
  PermissionController.createPermission
);
permisisonRouter.delete(
  '/permission/:permissionId',
  authenticationMiddleware,
  requiredRole('admin'),
  PermissionController.deletePermission
);

export default permisisonRouter;
