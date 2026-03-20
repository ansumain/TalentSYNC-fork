import express, { Router } from 'express';
const authRouter: Router = express.Router();
import { RegisterUserController } from '../controllers/registerUser.controller';
import { LoginUserController } from '../controllers/loginUser.controller';
import { LogoutUserController } from '../controllers/logoutUser.controller';
import { RefreshTokenController } from '../controllers/refreshToken.controller';
import { authenticationMiddleware } from '@talentsync/auth-middlewares';
import { RequestPasswordResetController } from '../controllers/requestPasswordReset.controller';
import { ResetPasswordController } from '../controllers/resetPassword.controller';

authRouter.post('/register', RegisterUserController.register);
authRouter.post('/login', LoginUserController.login);
authRouter.post('/logout', authenticationMiddleware, LogoutUserController.logout);
authRouter.post('/refresh-token', RefreshTokenController.getAccessToken);
authRouter.post('/forgot-password', RequestPasswordResetController.requestReset);
authRouter.post('/reset-password', ResetPasswordController.resetPassword);

export default authRouter;
