import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserProfileController } from '../controllers/userProfile.controller';
const userProfileRouter = express.Router();

userProfileRouter.get('/me', authMiddleware, UserProfileController.userProfile);

export default userProfileRouter;
