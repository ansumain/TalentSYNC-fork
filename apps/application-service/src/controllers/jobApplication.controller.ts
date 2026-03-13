import { Request, Response } from 'express';
import {
    addApplication,
    getAllApplications,
    getApplicationById,
    getApplicationsByJobId,
    getApplicationsByUserId,
    updateApplicationCurrentStatus,
    deleteExistingApplication,
    getRankedApplicantsByJobId,
    acceptOrRejectOffer
} from '../services/jobApplication.service';
import { parsePaginationParams } from '../utils/parsePaginationParams';

export class JobApplicationController {

    // add job application
    static async addApplication(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw new Error('missing required field');
            const jobId = req.params.jobId as string;
            const userId = req.userInfo.sub as string;

            const newApplication = await addApplication({ userId, jobId });

            if (newApplication) {
                res.status(201).json(newApplication);
            }

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('no resume found')) {
                res.status(403).json({ error: errorMessage });
                return;
            }
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

    // get all user's applications
    static async getMyApplications(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const { page, limit, sortBy, sortOrder, search } = parsePaginationParams(req.query);

            const result = await getApplicationsByUserId(userId, { page, limit, sortBy, sortOrder, search });
            res.status(200).json({
                applications: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            });
        } catch (e: unknown) {
            res.status(500).json({ error: e instanceof Error ? e.message : 'Internal server error' });
        }
    }

    // get all applications
    static async getAllApplications(req: Request, res: Response): Promise<void> {
        try {
            const { page, limit, sortBy, sortOrder, search } = parsePaginationParams(req.query);

            const result = await getAllApplications({ page, limit, sortBy, sortOrder, search });
            res.status(200).json({
                allApplications: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }

    // get application by applicationId
    static async getApplicationById(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.applicationId) throw new Error('missing required field');
            const applicationId = req.params.applicationId as string;

            const application = await getApplicationById(applicationId);

            if (application) {
                res.status(200).json({ application });
            }

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

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

    // get applications by jobId
    static async getApplicationsByJobId(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw new Error('missing required field');
            const jobId = req.params.jobId as string;

            const applicationsByJobId = await getApplicationsByJobId(jobId);

            if (applicationsByJobId) {
                res.status(200).json({ applicationsByJobId });
            }

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

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

    // update application currect status - applied | shortlisted | interviewing | hired/rejected 
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

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('no input') ||
                errorMessage.includes('missing required field') ||
                errorMessage.includes('manual status update') ||
                errorMessage.includes('can only shortlist')) {
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

    // delete application
    static async deleteExistingApplication(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.applicationId) throw new Error('missing required field');
            const applicationId = req.params.applicationId as string;

            const deleteApplication = await deleteExistingApplication(applicationId);
            if (deleteApplication) res.status(204).send();

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

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

    // rank candidates according to job skill requirements
    static async getRankedApplicantsByJobId(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.jobId) throw new Error('missing required field');
            const jobId = req.params.jobId as string;
            const rankedApplicants = await getRankedApplicantsByJobId(jobId);
            res.status(200).json({ rankedApplicants });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';
            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    // allows candidate to accept or reject an offer 
    // when applicationStatus is "selected" after interview
    static async acceptRejectJobOffer(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.applicationId) throw new Error('missing required field');
            const applicationId = req.params.applicationId as string;

            const { action } = req.body;
            if (!action || !['accept', 'reject'].includes(action)) {
                throw new Error('action must be accept or reject');
            }

            const userId = req.userInfo.sub as string;

            const result = await acceptOrRejectOffer(applicationId, userId, action as 'accept' | 'reject');
            res.status(200).json(result);

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('missing required field') ||
                errorMessage.includes('action must be')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('application not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('not a offer can\'t be responded')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }
}
