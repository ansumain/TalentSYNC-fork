import express, { Router } from 'express';
import { JobApplicationController } from '../controllers/jobApplication.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
const jobApplicationRouter: Router = express.Router();

jobApplicationRouter.post('/:jobId', authenticationMiddleware, JobApplicationController.addApplication);
jobApplicationRouter.get('/', authenticationMiddleware, JobApplicationController.getAllApplications);
jobApplicationRouter.get('/user/me', authenticationMiddleware, JobApplicationController.getMyApplications);
jobApplicationRouter.get('/job/:jobId', authenticationMiddleware, JobApplicationController.getApplicationsByJobId);
jobApplicationRouter.get('/:applicationId', authenticationMiddleware, JobApplicationController.getApplicationById);
jobApplicationRouter.patch('/:applicationId', authenticationMiddleware, JobApplicationController.updateApplicationCurrentStatus);
jobApplicationRouter.delete('/:applicationId', authenticationMiddleware, JobApplicationController.deleteExistingApplication);

export default jobApplicationRouter;