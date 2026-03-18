import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { getAllSkills, getUserSkills, addUserSkill, removeUserSkill } from '../services/skill.service';

export class SkillController {
    // get all skills present in the DB
    static async getAllSkills(_req: Request, res: Response): Promise<void> {
        try {
            const skills = await getAllSkills();
            res.status(200).json({ skills });
        } catch (error) {
            throw error;
        }
    }

    // get the current user's skills
    static async getMySkills(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const skills = await getUserSkills(userId);
            res.status(200).json({ skills });
        } catch (error) {
            throw error;
        }
    }

    // add a skill to the current user
    static async addMySkill(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const { skillId } = req.body;
            if (!skillId) throw badRequestError('skillId is required', 'SKILL_ID_REQUIRED');
            await addUserSkill(userId, skillId);
            res.status(201).json({ message: 'skill added' });
        } catch (error) {
            throw error;
        }
    }

    // remove a skill from the current user
    static async removeMySkill(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const skillId = req.params.skillId as string;
            await removeUserSkill(userId, skillId);
            res.status(200).json({ message: 'skill removed' });
        } catch (error) {
            throw error;
        }
    }
}   