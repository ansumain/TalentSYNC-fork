// import express, { Router } from 'express';
// import { Graphs } from '../controllers/graphs.controller';
// import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
// const graphRouter: Router = express.Router();

// graphRouter.get('/graphs', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), Graphs.getAllGraphData);

// export default graphRouter;


import express, { Router } from 'express';
import { Graphs } from '../controllers/graphs.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import { graphQuerySchema } from '../validations/request.validation';
const graphRouter: Router = express.Router();

graphRouter.get('/graphs', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ query: graphQuerySchema }), Graphs.getAllGraphData);

export default graphRouter;