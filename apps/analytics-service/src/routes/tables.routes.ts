// import express, { Router } from 'express';
// import { Tables } from '../controllers/tables.controller';
// import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
// const tableRouter: Router = express.Router();

// tableRouter.get('/tables', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Tables.getAllTableData);

// export default tableRouter;

import express, { Router } from 'express';
import { Tables } from '../controllers/tables.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import { tableQuerySchema } from '../validations/request.validation';
const tableRouter: Router = express.Router();

tableRouter.get('/tables', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ query: tableQuerySchema }), Tables.getAllTableData);

export default tableRouter;