import express, { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { authenticationMiddleware } from '@talentsync/auth-middlewares';
const candidateRouter: Router = express.Router();

candidateRouter.get('/resume-status', authenticationMiddleware, CandidateController.getMyResumeStatus);
candidateRouter.get('/my-resumes', authenticationMiddleware, CandidateController.getMyResumes);
candidateRouter.get('/parsed', authenticationMiddleware, CandidateController.getCandidateJSONData);
candidateRouter.get('/parsed/userId', authenticationMiddleware, CandidateController.getCandidateDataFromUserId);
candidateRouter.get('/parsed/resumeId', authenticationMiddleware, CandidateController.getCandidateDataFromResumeId);

export default candidateRouter;