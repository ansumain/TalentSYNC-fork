// import express, { Router } from 'express';
// import { InterviewController } from '../controllers/interview.controller';
// import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
// const interviewRouter: Router = express.Router();

// interviewRouter.get('/interviewers/available', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.getAvailableInterviewers);
// interviewRouter.get('/assigned', authenticationMiddleware, requiredAnyRole(['interviewer']), InterviewController.getAssignedInterviews);
// interviewRouter.get('/me', authenticationMiddleware, requiredAnyRole(['candidate']), InterviewController.getCandidateInterviews);
// interviewRouter.get('/job/:jobId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.getInterviewsByJobId);
// interviewRouter.get('/', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.getAllInterviews);
// interviewRouter.get('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.getInterviewById);

// interviewRouter.post('/', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.scheduleInterview);
// interviewRouter.patch('/:interviewId/result', authenticationMiddleware, requiredAnyRole(['interviewer']), InterviewController.submitInterviewResult);
// interviewRouter.patch('/:interviewId/cancel', authenticationMiddleware, requiredAnyRole(['admin', 'manager', 'interviewer']), InterviewController.cancelInterview);
// interviewRouter.patch('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), InterviewController.updateExistingInterview);
// interviewRouter.delete('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin']), InterviewController.deleteExistingInterview);

// export default interviewRouter;

import express, { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import {
	availableInterviewersQuerySchema,
	interviewResultBodySchema,
	paginationQuerySchema,
	scheduleInterviewBodySchema,
	updateInterviewBodySchema,
	uuidParamSchema,
} from '../validations/request.validation';
const interviewRouter: Router = express.Router();

interviewRouter.get('/interviewers/available', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ query: availableInterviewersQuerySchema }), InterviewController.getAvailableInterviewers);
interviewRouter.get('/assigned', authenticationMiddleware, requiredAnyRole(['interviewer']), InterviewController.getAssignedInterviews);
interviewRouter.get('/me', authenticationMiddleware, requiredAnyRole(['candidate']), InterviewController.getCandidateInterviews);
interviewRouter.get('/job/:jobId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ params: uuidParamSchema('jobId') }), InterviewController.getInterviewsByJobId);
interviewRouter.get('/', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ query: paginationQuerySchema }), InterviewController.getAllInterviews);
interviewRouter.get('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ params: uuidParamSchema('interviewId') }), InterviewController.getInterviewById);

interviewRouter.post('/', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ body: scheduleInterviewBodySchema }), InterviewController.scheduleInterview);
interviewRouter.patch('/:interviewId/result', authenticationMiddleware, requiredAnyRole(['interviewer']), validateRequest({ params: uuidParamSchema('interviewId'), body: interviewResultBodySchema }), InterviewController.submitInterviewResult);
interviewRouter.patch('/:interviewId/cancel', authenticationMiddleware, requiredAnyRole(['admin', 'manager', 'interviewer']), validateRequest({ params: uuidParamSchema('interviewId') }), InterviewController.cancelInterview);
interviewRouter.patch('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ params: uuidParamSchema('interviewId'), body: updateInterviewBodySchema }), InterviewController.updateExistingInterview);
interviewRouter.delete('/:interviewId', authenticationMiddleware, requiredAnyRole(['admin']), validateRequest({ params: uuidParamSchema('interviewId') }), InterviewController.deleteExistingInterview);

export default interviewRouter;