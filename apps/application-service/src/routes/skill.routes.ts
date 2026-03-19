import express, { Router } from 'express';
import { SkillController } from '../controllers/skill.controller';
import { authenticationMiddleware } from '@talentsync/auth-middlewares';

const skillRouter: Router = express.Router();

skillRouter.get('/', authenticationMiddleware, SkillController.getAllSkills);
skillRouter.get('/me', authenticationMiddleware, SkillController.getMySkills);
skillRouter.post('/me', authenticationMiddleware, SkillController.addMySkill);
skillRouter.delete('/me/:skillId', authenticationMiddleware, SkillController.removeMySkill);

export default skillRouter;