import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
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

            if (!req.params.jobId) throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            const jobId = req.params.jobId as string;
            const userId = req.userInfo.sub as string;

            const newApplication = await addApplication({ userId, jobId });

            if (newApplication) {
                res.status(201).json(newApplication);
            }

        } catch (error) {
            throw error;
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
        } catch (error) {
            throw error;
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
        } catch (error) {
            throw error;
        }
    }

    // get application by applicationId
    static async getApplicationById(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.applicationId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const applicationId = req.params.applicationId as string;

            const application = await getApplicationById(applicationId);

            if (application) {
                res.status(200).json({ application });
            }

        } catch (error) {
            throw error;
        }
    }

    // get applications by jobId
    static async getApplicationsByJobId(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            const jobId = req.params.jobId as string;

            const applicationsByJobId = await getApplicationsByJobId(jobId);

            if (applicationsByJobId) {
                res.status(200).json({ applicationsByJobId });
            }

        } catch (error) {
            throw error;
        }
    }

    // update application currect status - applied | shortlisted | interviewing | hired/rejected 
    static async updateApplicationCurrentStatus(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.applicationId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const applicationId = req.params.applicationId as string;

            const { currentStatus } = req.body;

            if (!currentStatus) throw badRequestError('no input', 'NO_INPUT');

            const updatedApplication = await updateApplicationCurrentStatus(applicationId, currentStatus);

            if (updatedApplication) {
                res.status(200).json(updatedApplication);
            }

        } catch (error) {
            throw error;
        }
    }

    // delete application
    static async deleteExistingApplication(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.applicationId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const applicationId = req.params.applicationId as string;

            const deleteApplication = await deleteExistingApplication(applicationId);
            if (deleteApplication) res.status(204).send();

        } catch (error) {
            throw error;
        }
    }

    // rank candidates according to job skill requirements
    static async getRankedApplicantsByJobId(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.jobId) throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            const jobId = req.params.jobId as string;
            const rankedApplicants = await getRankedApplicantsByJobId(jobId);
            res.status(200).json({ rankedApplicants });
        } catch (error) {
            throw error;
        }
    }

    // allows candidate to accept or reject an offer 
    // when applicationStatus is "selected" after interview
    static async acceptRejectJobOffer(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.applicationId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const applicationId = req.params.applicationId as string;

            const { action } = req.body;
            if (!action || !['accept', 'reject'].includes(action)) {
                throw badRequestError('action must be accept or reject', 'INVALID_ACTION');
            }

            const userId = req.userInfo.sub as string;

            const result = await acceptOrRejectOffer(applicationId, userId, action as 'accept' | 'reject');
            res.status(200).json(result);

        } catch (error) {
            throw error;
        }
    }
}
