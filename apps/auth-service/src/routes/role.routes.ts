import express from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredRole } from '../middlewares/authorization.middleware';
import { RoleController } from '../controllers/role.controller';
const roleRouter = express.Router();

roleRouter.get(
  '/roles',
  authenticationMiddleware,
  requiredRole('admin'),
  RoleController.getAllRoles
);
roleRouter.get(
  '/role/:userId',
  authenticationMiddleware,
  requiredRole('admin'),
  RoleController.getRoleByUserId
);
roleRouter.post(
  '/role',
  authenticationMiddleware,
  requiredRole('admin'),
  RoleController.createRole
);
roleRouter.delete(
  '/role/:roleId',
  authenticationMiddleware,
  requiredRole('admin'),
  RoleController.deleteRole
);

export default roleRouter;
