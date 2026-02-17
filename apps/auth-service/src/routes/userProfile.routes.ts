import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserProfileController } from '../controllers/userProfile.controller';
import { UpdateUserProfileController } from '../controllers/updateUserProfile.controller';
import { UpdatePasswordController } from '../controllers/updatePassword.controller';
const userProfileRouter = express.Router();

userProfileRouter.get('/me', authMiddleware, UserProfileController.userProfile);
userProfileRouter.put('/me', authMiddleware, UpdateUserProfileController.updateUserProfile);
userProfileRouter.patch('/me/password', authMiddleware, UpdatePasswordController.updatePassword);

export default userProfileRouter;
