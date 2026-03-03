import express, { Router } from 'express';
import { JobApplicationController } from '../controllers/jobApplication.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
const jobApplicationRouter: Router = express.Router();

jobApplicationRouter.post('/:jobId', authenticationMiddleware, JobApplicationController.addApplication);
jobApplicationRouter.get('/', authenticationMiddleware, JobApplicationController.getAllApplications);
jobApplicationRouter.get('/:applicationId', authenticationMiddleware, JobApplicationController.getApplicationById);

export default jobApplicationRouter;