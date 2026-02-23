import express from 'express';
import { resumeUpload } from '../middlewares/multer.middleware';
import { ResumeParserController } from '../controllers/resume-parser.controller';
const resumeRouter = express.Router();

resumeRouter.post('/upload', resumeUpload, ResumeParserController.parseResume);

export default resumeRouter;