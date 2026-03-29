// import express, { Router } from 'express';
// import { Counters } from '../controllers/counters.controller';
// import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
// const counterRouter: Router = express.Router();

// counterRouter.get('/counters', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Counters.getAllCounterData);

// export default counterRouter;


import express, { Router } from 'express';
import { Counters } from '../controllers/counters.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import { analyticsQuerySchema } from '../validations/request.validation';
const counterRouter: Router = express.Router();

counterRouter.get('/counters', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ query: analyticsQuerySchema }), Counters.getAllCounterData);

export default counterRouter;