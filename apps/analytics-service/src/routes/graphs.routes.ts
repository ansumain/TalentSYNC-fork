import express, { Router } from 'express';
import { Graphs } from '../controllers/graphs.controller';
const graphRouter: Router = express.Router();

graphRouter.get('/graphs', Graphs.getAllGraphData);

export default graphRouter;