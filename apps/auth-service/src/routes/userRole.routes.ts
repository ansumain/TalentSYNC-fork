import express from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredRole } from '../middlewares/authorization.middleware';
import { UserRoleController } from '../controllers/userRole.controller';
const userRoleRouter = express.Router();

userRoleRouter.post(
  '/assign-role/:userId',
  authenticationMiddleware,
  requiredRole('admin'),
  UserRoleController.assignRoleToUser
);
userRoleRouter.delete(
  '/revoke-role/:userId/:roleId',
  authenticationMiddleware,
  requiredRole('admin'),
  UserRoleController.revokeRoleFromUser
);

export default userRoleRouter;
