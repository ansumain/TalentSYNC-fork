import express from 'express';
const authRouter = express.Router();
import { RegisterUserController } from '../controllers/registerUser.controller';
import { LoginUserController } from '../controllers/loginUser.controller';
import { LogoutUserController } from '../controllers/logoutUser.controller';
import { RefreshTokenController } from '../controllers/refreshToken.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

authRouter.post('/register', RegisterUserController.register);
authRouter.post('/login', LoginUserController.login);
authRouter.post('/logout', authMiddleware, LogoutUserController.logout);
authRouter.post('/refresh-token', RefreshTokenController.getAccessToken);

export default authRouter;
