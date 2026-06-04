import express, { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticationMiddleware } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import { createJobBodySchema, paginationQuerySchema, updateJobBodySchema, uuidParamSchema } from '../validations/request.validation';
const jobRouter: Router = express.Router();

jobRouter.post('/', authenticationMiddleware, validateRequest({ body: createJobBodySchema }), JobController.addAJob);
jobRouter.get('/', authenticationMiddleware, validateRequest({ query: paginationQuerySchema }), JobController.getAllJobs);
jobRouter.get('/:jobId', authenticationMiddleware, validateRequest({ params: uuidParamSchema('jobId') }), JobController.getJobById);
jobRouter.patch('/:jobId', authenticationMiddleware, validateRequest({ params: uuidParamSchema('jobId'), body: updateJobBodySchema }), JobController.updateExistingJob);
jobRouter.delete('/:jobId', authenticationMiddleware, validateRequest({ params: uuidParamSchema('jobId') }), JobController.deleteExistingJob);

export default jobRouter;