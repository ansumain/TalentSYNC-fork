import express, { Router } from 'express';
import { Counters } from '../controllers/counters.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
const counterRouter: Router = express.Router();

counterRouter.get('/counters', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Counters.getAllCounterData);

export default counterRouter;