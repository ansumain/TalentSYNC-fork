import express from 'express';
const authRouter = express.Router();
import { RegisterUserController } from '../controllers/registerUser.controller';
import { LoginUserController } from '../controllers/loginUser.controller';
import { LogoutUserController } from '../controllers/logoutUser.controller';
import { RefreshTokenController } from '../controllers/refreshToken.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';

authRouter.post('/register', RegisterUserController.register);
authRouter.post('/login', LoginUserController.login);
authRouter.post('/logout', authenticationMiddleware, LogoutUserController.logout);
authRouter.post('/refresh-token', RefreshTokenController.getAccessToken);

export default authRouter;
