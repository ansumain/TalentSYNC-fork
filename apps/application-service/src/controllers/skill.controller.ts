import { Request, Response } from 'express';
import { getAllSkills } from '../services/skill.service';

export class SkillController {
    static async getAllSkills(req: Request, res: Response): Promise<void> {
        try {
            const skills = await getAllSkills();
            res.status(200).json({ skills });
        } catch (e: any) {
            res.status(500).json({ error: e.message || 'Internal server error' });
        }
    }
}