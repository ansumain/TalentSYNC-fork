import express, { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
const candidateRouter: Router = express.Router();

candidateRouter.get('/parsed', authenticationMiddleware, CandidateController.getCandidateJSONData);
candidateRouter.get('/parsed/filter/name', authenticationMiddleware, CandidateController.getCandidateDataFromName);
candidateRouter.get('/parsed/userId', authenticationMiddleware, CandidateController.getCandidateDataFromUserId);
candidateRouter.get('/parsed/resumeId', authenticationMiddleware, CandidateController.getCandidateDataFromResumeId);

export default candidateRouter;