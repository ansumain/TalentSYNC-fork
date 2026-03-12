import { Request, Response } from 'express';
import { getAllSkills, getUserSkills, addUserSkill, removeUserSkill } from '../services/skill.service';

export class SkillController {
    // get all skills present in the DB
    static async getAllSkills(req: Request, res: Response): Promise<void> {
        try {
            const skills = await getAllSkills();
            res.status(200).json({ skills });
        } catch (e: unknown) {
            res.status(500).json({ error: e instanceof Error ? e.message : 'Internal server error' });
        }
    }

    // get the current user's skills
    static async getMySkills(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const skills = await getUserSkills(userId);
            res.status(200).json({ skills });
        } catch (e: unknown) {
            res.status(500).json({ error: e instanceof Error ? e.message : 'Internal server error' });
        }
    }

    // add a skill to the current user
    static async addMySkill(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const { skillId } = req.body;
            if (!skillId) { res.status(400).json({ error: 'skillId is required' }); return; }
            await addUserSkill(userId, skillId);
            res.status(201).json({ message: 'skill added' });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';
            res.status(errorMessage === 'skill already added' ? 409 : 500).json({ error: errorMessage });
        }
    }

    // remove a skill from the current user
    static async removeMySkill(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const skillId = req.params.skillId as string;
            await removeUserSkill(userId, skillId);
            res.status(200).json({ message: 'skill removed' });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';
            res.status(errorMessage === 'skill not found' ? 404 : 500).json({ error: errorMessage });
        }
    }
}   