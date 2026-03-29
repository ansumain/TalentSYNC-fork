// import express, { Router } from 'express';
// import { authenticationMiddleware } from '@talentsync/auth-middlewares';
// import { UserProfileController } from '../controllers/userProfile.controller';
// import { UpdateUserProfileController } from '../controllers/updateUserProfile.controller';
// import { UpdatePasswordController } from '../controllers/updatePassword.controller';
// const userProfileRouter: Router = express.Router();

// userProfileRouter.get('/me', authenticationMiddleware, UserProfileController.userProfile);
// userProfileRouter.put(
//   '/me',
//   authenticationMiddleware,
//   UpdateUserProfileController.updateUserProfile
// );
// userProfileRouter.patch(
//   '/me/password',
//   authenticationMiddleware,
//   UpdatePasswordController.updatePassword
// );

// export default userProfileRouter;


import express, { Router } from 'express';
import { authenticationMiddleware } from '@talentsync/auth-middlewares';
import { UserProfileController } from '../controllers/userProfile.controller';
import { UpdateUserProfileController } from '../controllers/updateUserProfile.controller';
import { UpdatePasswordController } from '../controllers/updatePassword.controller';
import { validateRequest } from '@talentsync/validation-middleware';
import { updatePasswordBodySchema, updateUserProfileBodySchema } from '../validations/request.validation';
const userProfileRouter: Router = express.Router();

userProfileRouter.get('/me', authenticationMiddleware, UserProfileController.userProfile);
userProfileRouter.put(
  '/me',
  authenticationMiddleware,
  validateRequest({ body: updateUserProfileBodySchema }),
  UpdateUserProfileController.updateUserProfile
);
userProfileRouter.patch(
  '/me/password',
  authenticationMiddleware,
  validateRequest({ body: updatePasswordBodySchema }),
  UpdatePasswordController.updatePassword
);

export default userProfileRouter;
