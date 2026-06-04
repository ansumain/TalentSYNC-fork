import express, { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { authenticationMiddleware } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import { candidateByResumeQuerySchema, candidateByUserQuerySchema, paginationQuerySchema } from '../validations/request.validation';
const candidateRouter: Router = express.Router();

candidateRouter.get('/resume-status', authenticationMiddleware, CandidateController.getMyResumeStatus);
candidateRouter.get('/my-resumes', authenticationMiddleware, CandidateController.getMyResumes);
candidateRouter.get('/parsed', authenticationMiddleware, validateRequest({ query: paginationQuerySchema }), CandidateController.getCandidateJSONData);
candidateRouter.get('/parsed/userId', authenticationMiddleware, validateRequest({ query: candidateByUserQuerySchema }), CandidateController.getCandidateDataFromUserId);
candidateRouter.get('/parsed/resumeId', authenticationMiddleware, validateRequest({ query: candidateByResumeQuerySchema }), CandidateController.getCandidateDataFromResumeId);

export default candidateRouter;