import express, { Router } from 'express';
import { JobApplicationController } from '../controllers/jobApplication.controller';
import { authenticationMiddleware, requiredAnyRole } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import {
	acceptRejectOfferBodySchema,
	paginationQuerySchema,
	updateApplicationStatusBodySchema,
	uuidParamSchema,
} from '../validations/request.validation';
const jobApplicationRouter: Router = express.Router();

jobApplicationRouter.get('/', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ query: paginationQuerySchema }), JobApplicationController.getAllApplications);
jobApplicationRouter.get('/user/me', authenticationMiddleware, requiredAnyRole(['candidate']), validateRequest({ query: paginationQuerySchema }), JobApplicationController.getMyApplications);
jobApplicationRouter.get('/job/:jobId/ranked', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ params: uuidParamSchema('jobId') }), JobApplicationController.getRankedApplicantsByJobId);
jobApplicationRouter.get('/job/:jobId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ params: uuidParamSchema('jobId') }), JobApplicationController.getApplicationsByJobId);
jobApplicationRouter.get('/:applicationId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ params: uuidParamSchema('applicationId') }), JobApplicationController.getApplicationById);

jobApplicationRouter.post('/:jobId', authenticationMiddleware, requiredAnyRole(['candidate']), validateRequest({ params: uuidParamSchema('jobId') }), JobApplicationController.addApplication);
jobApplicationRouter.patch('/:applicationId/offer', authenticationMiddleware, requiredAnyRole(['candidate']), validateRequest({ params: uuidParamSchema('applicationId'), body: acceptRejectOfferBodySchema }), JobApplicationController.acceptRejectJobOffer);
jobApplicationRouter.patch('/:applicationId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), validateRequest({ params: uuidParamSchema('applicationId'), body: updateApplicationStatusBodySchema }), JobApplicationController.updateApplicationCurrentStatus);
jobApplicationRouter.delete('/:applicationId', authenticationMiddleware, requiredAnyRole(['admin']), validateRequest({ params: uuidParamSchema('applicationId') }), JobApplicationController.deleteExistingApplication);

export default jobApplicationRouter;