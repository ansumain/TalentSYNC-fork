import express, { Router } from 'express';
import { JobApplicationController } from '../controllers/jobApplication.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { requiredAnyRole } from '../middlewares/authorization.middleware';
const jobApplicationRouter: Router = express.Router();

jobApplicationRouter.get('/', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), JobApplicationController.getAllApplications);
jobApplicationRouter.get('/user/me', authenticationMiddleware, requiredAnyRole(['candidate']), JobApplicationController.getMyApplications);
jobApplicationRouter.get('/job/:jobId/ranked', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), JobApplicationController.getRankedApplicantsByJobId);
jobApplicationRouter.get('/job/:jobId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), JobApplicationController.getApplicationsByJobId);
jobApplicationRouter.get('/:applicationId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), JobApplicationController.getApplicationById);

jobApplicationRouter.post('/:jobId', authenticationMiddleware, requiredAnyRole(['candidate']), JobApplicationController.addApplication);
jobApplicationRouter.patch('/:applicationId/offer', authenticationMiddleware, requiredAnyRole(['candidate']), JobApplicationController.acceptRejectJobOffer);
jobApplicationRouter.patch('/:applicationId', authenticationMiddleware, requiredAnyRole(['admin', 'manager']), JobApplicationController.updateApplicationCurrentStatus);
jobApplicationRouter.delete('/:applicationId', authenticationMiddleware, requiredAnyRole(['admin']), JobApplicationController.deleteExistingApplication);

export default jobApplicationRouter;