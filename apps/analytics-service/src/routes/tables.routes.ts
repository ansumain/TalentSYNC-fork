import express, { Router } from 'express';
import { Tables } from '../controllers/tables.controller';
const tableRouter: Router = express.Router();

tableRouter.get('/tables', Tables.getAllTableData);

export default tableRouter;