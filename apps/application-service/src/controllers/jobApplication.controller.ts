import { Request, Response } from 'express';
import {
    addApplication,
    getAllApplications,
    getApplicationById,
    getApplicationsByJobId,
    updateApplicationCurrentStatus,
    deleteExistingApplication
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

    static async getAllApplications(req: Request, res: Response): Promise<void> {
        try {
            const allApplications = await getAllApplications();

            if (allApplications) {
                res.status(200).json({ allApplications });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }

    static async getApplicationById(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.applicationId) throw new Error('missing required field');
            const applicationId = req.params.applicationId as string;

            const application = await getApplicationById(applicationId);

            if (application) {
                res.status(200).json({ application });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            if (errorMessage.includes('application not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    static async getApplicationsByJobId(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw new Error('missing required field');
            const jobId = req.params.jobId as string;

            const applicationsByJobId = await getApplicationsByJobId(jobId);

            if (applicationsByJobId) {
                res.status(200).json({ applicationsByJobId });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            if (errorMessage.includes('applications not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    static async updateApplicationCurrentStatus(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.applicationId) throw new Error('missing required field');
            const applicationId = req.params.applicationId as string;

            const { currentStatus } = req.body;

            if (!currentStatus) throw new Error('no input');

            const updatedApplication = await updateApplicationCurrentStatus(applicationId, currentStatus);

            if (updatedApplication) {
                res.status(200).json(updatedApplication);
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('no input')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            if (errorMessage.includes('application not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    static async deleteExistingApplication(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.applicationId) throw new Error('missing required field');
            const applicationId = req.params.applicationId as string;

            const deleteApplication = await deleteExistingApplication(applicationId);
            if (deleteApplication) res.status(204).send();

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            if (errorMessage.includes('application not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }

            res.status(500).json({ error: errorMessage });
        }
    }
}
