import express, { Router } from 'express';
import { ExportController } from '../controllers/export.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';

const exportRouter: Router = express.Router();

exportRouter.post('/exports', authenticationMiddleware, requiredAnyRole(['admin']), ExportController.requestExport);

export default exportRouter;