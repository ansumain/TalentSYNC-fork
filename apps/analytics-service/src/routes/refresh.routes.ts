import express, { Router } from 'express';
import { RefreshController } from '../controllers/refresh.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredAnyRole } from '../middlewares/authorization.middleware';

const refreshRouter: Router = express.Router();

refreshRouter.get('/refresh/status', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), RefreshController.getLatestRefreshStatus);
refreshRouter.post('/refresh', authenticationMiddleware, requiredAnyRole(['admin']), RefreshController.triggerManualRefresh);

export default refreshRouter;
