import express, { Router } from 'express';
import { ExportController } from '../controllers/export.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import { exportRequestBodySchema } from '../validations/request.validation';

const exportRouter: Router = express.Router();

exportRouter.post('/exports', authenticationMiddleware, requiredAnyRole(['admin']), validateRequest({ body: exportRequestBodySchema }), ExportController.requestExport);

export default exportRouter;