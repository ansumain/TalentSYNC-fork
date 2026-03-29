// import express, { Router } from 'express';
// import { authenticationMiddleware, requiredRole } from '@talentsync/auth-middlewares';
// import { UserRoleController } from '../controllers/userRole.controller';
// const userRoleRouter: Router = express.Router();

// userRoleRouter.post(
//   '/assign-role/:userId',
//   authenticationMiddleware,
//   requiredRole('admin'),
//   UserRoleController.assignRoleToUser
// );
// userRoleRouter.delete(
//   '/revoke-role/:userId/:roleId',
//   authenticationMiddleware,
//   requiredRole('admin'),
//   UserRoleController.revokeRoleFromUser
// );

// export default userRoleRouter;


import express, { Router } from 'express';
import { authenticationMiddleware, requiredRole } from '@talentsync/auth-middlewares';
import { UserRoleController } from '../controllers/userRole.controller';
import { validateRequest } from '@talentsync/validation-middleware';
import { assignRoleBodySchema, uuidParamSchema } from '../validations/request.validation';
const userRoleRouter: Router = express.Router();

userRoleRouter.post(
  '/assign-role/:userId',
  authenticationMiddleware,
  requiredRole('admin'),
  validateRequest({ params: uuidParamSchema('userId'), body: assignRoleBodySchema }),
  UserRoleController.assignRoleToUser
);
userRoleRouter.delete(
  '/revoke-role/:userId/:roleId',
  authenticationMiddleware,
  requiredRole('admin'),
  validateRequest({ params: uuidParamSchema('userId').and(uuidParamSchema('roleId')) }),
  UserRoleController.revokeRoleFromUser
);

export default userRoleRouter;




