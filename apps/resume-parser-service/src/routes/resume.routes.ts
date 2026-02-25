import express from 'express';
import { resumeUpload } from '../middlewares/multer.middleware';
// import { ResumeParserController } from '../controllers/resume-parser.controller';
import { ResumeUploaderController } from '../controllers/resume-upload.controller';
const resumeRouter = express.Router();

resumeRouter.post('/upload', resumeUpload, ResumeUploaderController.uploadResume);

export default resumeRouter;