import express, { Router } from 'express';
import { Graphs } from '../controllers/graphs.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
const graphRouter: Router = express.Router();

graphRouter.get('/graphs', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Graphs.getAllGraphData);

export default graphRouter;