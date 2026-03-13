import express, { Router } from 'express';
import { Graphs } from '../controllers/graphs.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredAnyRole } from '../middlewares/authorization.middleware';
const graphRouter: Router = express.Router();

graphRouter.get('/graphs', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Graphs.getAllGraphData);

export default graphRouter;