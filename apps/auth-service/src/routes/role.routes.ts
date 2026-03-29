// import express, { Router } from 'express';
// import { authenticationMiddleware, requiredRole } from '@talentsync/auth-middlewares';
// import { RoleController } from '../controllers/role.controller';
// const roleRouter: Router = express.Router();

// roleRouter.get(
//   '/roles',
//   authenticationMiddleware,
//   requiredRole('admin'),
//   RoleController.getAllRoles
// );
// roleRouter.get(
//   '/role/:userId',
//   authenticationMiddleware,
//   requiredRole('admin'),
//   RoleController.getRoleByUserId
// );
// roleRouter.post(
//   '/role',
//   authenticationMiddleware,
//   requiredRole('admin'),
//   RoleController.createRole
// );
// roleRouter.delete(
//   '/role/:roleId',
//   authenticationMiddleware,
//   requiredRole('admin'),
//   RoleController.deleteRole
// );

// export default roleRouter;

import express, { Router } from 'express';
import { authenticationMiddleware, requiredRole } from '@talentsync/auth-middlewares';
import { RoleController } from '../controllers/role.controller';
import { validateRequest } from '@talentsync/validation-middleware';
import { createRoleBodySchema, uuidParamSchema } from '../validations/request.validation';
const roleRouter: Router = express.Router();

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
  validateRequest({ params: uuidParamSchema('userId') }),
  RoleController.getRoleByUserId
);
roleRouter.post(
  '/role',
  authenticationMiddleware,
  requiredRole('admin'),
  validateRequest({ body: createRoleBodySchema }),
  RoleController.createRole
);
roleRouter.delete(
  '/role/:roleId',
  authenticationMiddleware,
  requiredRole('admin'),
  validateRequest({ params: uuidParamSchema('roleId') }),
  RoleController.deleteRole
);

export default roleRouter;
