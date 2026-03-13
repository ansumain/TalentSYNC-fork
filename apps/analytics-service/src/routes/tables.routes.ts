import express, { Router } from 'express';
import { Tables } from '../controllers/tables.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredAnyRole } from '../middlewares/authorization.middleware';
const tableRouter: Router = express.Router();

tableRouter.get('/tables', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Tables.getAllTableData);

export default tableRouter;