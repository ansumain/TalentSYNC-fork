import express, { Router } from 'express';
import { SkillController } from '../controllers/skill.controller';
import { authenticationMiddleware } from '@talentsync/auth-middlewares';
import { validateRequest } from '@talentsync/validation-middleware';
import { addMySkillBodySchema, uuidParamSchema } from '../validations/request.validation';

const skillRouter: Router = express.Router();

skillRouter.get('/', authenticationMiddleware, SkillController.getAllSkills);
skillRouter.get('/me', authenticationMiddleware, SkillController.getMySkills);
skillRouter.post('/me', authenticationMiddleware, validateRequest({ body: addMySkillBodySchema }), SkillController.addMySkill);
skillRouter.delete('/me/:skillId', authenticationMiddleware, validateRequest({ params: uuidParamSchema('skillId') }), SkillController.removeMySkill);

export default skillRouter;