import express, { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { UserProfileController } from '../controllers/userProfile.controller';
import { UpdateUserProfileController } from '../controllers/updateUserProfile.controller';
import { UpdatePasswordController } from '../controllers/updatePassword.controller';
const userProfileRouter: Router = express.Router();

userProfileRouter.get('/me', authenticationMiddleware, UserProfileController.userProfile);
userProfileRouter.put(
  '/me',
  authenticationMiddleware,
  UpdateUserProfileController.updateUserProfile
);
userProfileRouter.patch(
  '/me/password',
  authenticationMiddleware,
  UpdatePasswordController.updatePassword
);

export default userProfileRouter;
