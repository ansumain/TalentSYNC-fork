import express, { Router } from 'express';
import { Counters } from '../controllers/counters.controller';
const counterRouter: Router = express.Router();

counterRouter.get('/counters', Counters.getAllCounterData);

export default counterRouter;