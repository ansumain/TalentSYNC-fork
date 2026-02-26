import express, { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
const candidateRouter: Router = express.Router();

candidateRouter.get('/parsed', CandidateController.getCandidateJSONData);
candidateRouter.get('/parsed/filter/name', CandidateController.getCandidateDataFromName);
candidateRouter.get('/parsed/filter/userId', CandidateController.getCandidateDataFromUserId);

export default candidateRouter;