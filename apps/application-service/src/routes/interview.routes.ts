import express, { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
const interviewRouter: Router = express.Router();

interviewRouter.post('/', authenticationMiddleware, InterviewController.scheduleInterview);
interviewRouter.get('/', authenticationMiddleware, InterviewController.getAllInterviews);
interviewRouter.get('/:interviewId', authenticationMiddleware, InterviewController.getInterviewById);
interviewRouter.get('/job/:jobId', authenticationMiddleware, InterviewController.getInterviewsByJobId);

export default interviewRouter;