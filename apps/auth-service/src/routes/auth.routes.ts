import express, { Router } from 'express';
const authRouter: Router = express.Router();
import { RegisterUserController } from '../controllers/registerUser.controller';
import { LoginUserController } from '../controllers/loginUser.controller';
import { LogoutUserController } from '../controllers/logoutUser.controller';
import { RefreshTokenController } from '../controllers/refreshToken.controller';
import { authenticationMiddleware } from '@talentsync/auth-middlewares';
import { RequestPasswordResetController } from '../controllers/requestPasswordReset.controller';
import { ResetPasswordController } from '../controllers/resetPassword.controller';
import { validateRequest } from '@talentsync/validation-middleware';
import { loginBodySchema, registerBodySchema, requestResetBodySchema, resetPasswordBodySchema } from '../validations/request.validation';

authRouter.post('/register', validateRequest({ body: registerBodySchema }), RegisterUserController.register);
authRouter.post('/login', validateRequest({ body: loginBodySchema }), LoginUserController.login);
authRouter.post('/logout', authenticationMiddleware, LogoutUserController.logout);
authRouter.post('/refresh-token', RefreshTokenController.getAccessToken);
authRouter.post('/forgot-password', validateRequest({ body: requestResetBodySchema }), RequestPasswordResetController.requestReset);
authRouter.post('/reset-password', validateRequest({ body: resetPasswordBodySchema }), ResetPasswordController.resetPassword);

export default authRouter;
