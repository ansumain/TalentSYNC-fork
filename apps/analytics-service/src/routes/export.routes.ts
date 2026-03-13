import express, { Router } from 'express';
import { ExportController } from '../controllers/export.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredAnyRole } from '../middlewares/authorization.middleware';

const exportRouter: Router = express.Router();

exportRouter.post('/exports', authenticationMiddleware, requiredAnyRole(['admin']), ExportController.requestExport);

export default exportRouter;