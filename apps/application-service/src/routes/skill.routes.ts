import express, { Router } from 'express';
import { SkillController } from '../controllers/skill.controller';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';

const skillRouter: Router = express.Router();

skillRouter.get('/', authenticationMiddleware, SkillController.getAllSkills);

export default skillRouter;