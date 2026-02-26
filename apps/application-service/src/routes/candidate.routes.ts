import express, { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
const candidateRouter: Router = express.Router();

candidateRouter.get('/parsed', CandidateController.getCandidateJSONData);

export default candidateRouter;