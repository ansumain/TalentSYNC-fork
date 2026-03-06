import express, { Router } from 'express';
import { resumeUpload } from '../middlewares/multer.middleware';
import { ResumeUploaderController } from '../controllers/resume-upload.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
const resumeRouter: Router = express.Router();

resumeRouter.post('/upload', authenticationMiddleware, resumeUpload, ResumeUploaderController.uploadResume);

export default resumeRouter;