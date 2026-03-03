import { Request, Response } from 'express';
import {
    addApplication,
} from '../services/jobApplication.service';

export class JobApplicationController {

    static async addApplication(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw new Error('missing required field');
            const jobId = req.params.jobId as string;
            const userId = req.userInfo.sub;

            const newApplication = await addApplication({ userId, jobId });

            if (newApplication) {
                res.status(201).json(newApplication);
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('application already exists')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            res.status(500).json({ error: errorMessage });
        }
    }
}
