import express, { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredAnyRole } from '../middlewares/authorization.middleware';
const interviewRouter: Router = express.Router();

interviewRouter.get('/interviewers/available', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.getAvailableInterviewers);
interviewRouter.get('/assigned', authenticationMiddleware, requiredAnyRole(['interviewer']), InterviewController.getAssignedInterviews);
interviewRouter.get('/me', authenticationMiddleware, requiredAnyRole(['candidate']), InterviewController.getCandidateInterviews);
interviewRouter.get('/job/:jobId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.getInterviewsByJobId);
interviewRouter.get('/', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.getAllInterviews);
interviewRouter.get('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.getInterviewById);

interviewRouter.post('/', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.scheduleInterview);
interviewRouter.patch('/:interviewId/result', authenticationMiddleware, requiredAnyRole(['interviewer']), InterviewController.submitInterviewResult);
interviewRouter.patch('/:interviewId/cancel', authenticationMiddleware, requiredAnyRole(['admin', 'manager', 'interviewer']), InterviewController.cancelInterview);
interviewRouter.patch('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.updateExistingInterview);
interviewRouter.delete('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin']), InterviewController.deleteExistingInterview);

export default interviewRouter;