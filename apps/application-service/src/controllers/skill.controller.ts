import { Request, Response } from 'express';
import { getAllSkills } from '../services/skill.service';

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
}