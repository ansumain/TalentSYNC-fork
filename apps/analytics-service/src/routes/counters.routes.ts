import express, { Router } from 'express';
import { Counters } from '../controllers/counters.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredAnyRole } from '../middlewares/authorization.middleware';
const counterRouter: Router = express.Router();

counterRouter.get('/counters', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Counters.getAllCounterData);

export default counterRouter;