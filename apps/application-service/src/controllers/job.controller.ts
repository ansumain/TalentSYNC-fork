import { Request, Response } from 'express';
import { addAJob } from '../services/job.service';

export class JobController {

    static async addAJob(req: Request, res: Response): Promise<void> {
        try {

            if (!req.body.title || 
                !req.body.description || 
                req.body.openings === undefined ||
                !req.body.location ||
                !req.body.jobType
            ) throw new Error('Missing required field');

            const userId = req.userInfo.sub;

            const { title, description, location, jobType, openings } = req.body;

            const newJob = await addAJob({ title, description, location, jobType, openings, createdBy: userId });

            if (newJob) {
                res.status(200).json({
                    newJob
                });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }
}
