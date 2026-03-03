import express, { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
const interviewRouter: Router = express.Router();

interviewRouter.post('/', authenticationMiddleware, InterviewController.scheduleInterview);

export default interviewRouter;