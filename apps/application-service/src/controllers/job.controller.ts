import { Request, Response } from 'express';
import { addAJob, deleteExistingJob, getJobById, getAllJobs, updateExistingJob } from '../services/job.service';
import { CreateJob } from '../types/Job.type';

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

            const { title, description, location, jobType, openings, skillIds } = req.body;

            if (!Number.isInteger(openings) || openings < 1) throw new Error('invalid openings');

            const newJob = {
                title: title.trim(),
                description: description.trim(),
                location: location.trim(),
                jobType: jobType.trim(),
                openings,
                createdBy: userId.trim(),
                skillIds: Array.isArray(skillIds) ? skillIds : [],
            }

            for (const key of Object.keys(newJob) as Array<keyof typeof newJob>)
                if (typeof newJob[key] === 'string' && newJob[key].length === 0) throw new Error('missing required field');

            const newJobCreated = await addAJob(newJob);

            if (newJobCreated) {
                res.status(201).json(newJobCreated);
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('invalid openings')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            res.status(500).json({ error: errorMessage });
        }
    }

    static async getAllJobs(req: Request, res: Response): Promise<void> {
        try {
            const currentJobs = await getAllJobs();

            if (currentJobs) {
                res.status(200).json({ currentJobs });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }

    static async getJobById(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw new Error('Missing required field');
            const jobId = req.params.jobId as string;

            const job = await getJobById(jobId);

            if (job) {
                res.status(200).json({ job });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('job not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    static async updateExistingJob(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.jobId) throw new Error('Missing required field');
            const jobId = req.params.jobId as string;

            const { title, description, location, jobType, openings } = req.body;

            let fieldsToUpdate: Partial<CreateJob> = {};
            if (title) fieldsToUpdate.title = title.trim();
            if (description) fieldsToUpdate.description = description.trim();
            if (location) fieldsToUpdate.location = location.trim();
            if (jobType) fieldsToUpdate.jobType = jobType.trim();

            if (openings !== undefined) {
                if (!Number.isInteger(openings) || openings < 1) throw new Error('invalid openings');
                fieldsToUpdate.openings = openings;
            }

            if (Object.keys(fieldsToUpdate).length === 0) throw new Error('no input');

            const updatedJob = await updateExistingJob(jobId, fieldsToUpdate);

            if (updatedJob) {
                res.status(200).json(updatedJob);
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('no input')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            if (errorMessage.includes('invalid openings')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            if (errorMessage.includes('job not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    static async deleteExistingJob(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw new Error('Missing required field');
            const jobId = req.params.jobId as string;

            const deleteJob = await deleteExistingJob(jobId);
            if (deleteJob) res.status(204).send();

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('job not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }

            res.status(500).json({ error: errorMessage });
        }
    }
}
