import express, { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
const jobRouter: Router = express.Router();

jobRouter.post('/', authenticationMiddleware, JobController.addAJob);
jobRouter.get('/', authenticationMiddleware, JobController.getAllJobs);
jobRouter.get('/:jobId', authenticationMiddleware, JobController.getJobById);
jobRouter.patch('/:jobId', authenticationMiddleware, JobController.updateExistingJob);
jobRouter.delete('/:jobId', authenticationMiddleware, JobController.deleteExistingJob);

export default jobRouter;