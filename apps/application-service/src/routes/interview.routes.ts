import express, { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
const interviewRouter: Router = express.Router();

interviewRouter.get('/interviewers/available', authenticationMiddleware, InterviewController.getAvailableInterviewers);
interviewRouter.post('/', authenticationMiddleware, InterviewController.scheduleInterview);
interviewRouter.get('/', authenticationMiddleware, InterviewController.getAllInterviews);
interviewRouter.get('/:interviewId', authenticationMiddleware, InterviewController.getInterviewById);
interviewRouter.get('/job/:jobId', authenticationMiddleware, InterviewController.getInterviewsByJobId);
interviewRouter.patch('/:interviewId', authenticationMiddleware, InterviewController.updateExistingInterview);
interviewRouter.delete('/:interviewId', authenticationMiddleware, InterviewController.deleteExistingInterview);

export default interviewRouter;