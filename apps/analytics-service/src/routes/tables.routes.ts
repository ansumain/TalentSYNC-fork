import express, { Router } from 'express';
import { Tables } from '../controllers/tables.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
const tableRouter: Router = express.Router();

tableRouter.get('/tables', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Tables.getAllTableData);

export default tableRouter;