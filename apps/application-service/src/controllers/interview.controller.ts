import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import {
    getAvailableInterviewers,
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByJobId,
    getAssignedInterviews,
    getCandidateInterviews,
    updateExistingInterview,
    submitInterviewResult,
    cancelInterview,
    deleteExistingInterview
} from '../services/interview.service';

export class InterviewController {

    // get available interviewers for a given date and application
    static async getAvailableInterviewers(req: Request, res: Response): Promise<void> {
        try {
            const { date, applicationId } = req.query as { date: string; applicationId: string };

            if (!date || !applicationId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }

            const availableInterviewers = await getAvailableInterviewers(date, applicationId);
            res.status(200).json({ availableInterviewers });

        } catch (error) {
            throw error;
        }
    }

    // get all assigned interviews
    static async getAssignedInterviews(req: Request, res: Response): Promise<void> {
        try {
            const interviewerId = req.userInfo.sub as string;
            const interviews = await getAssignedInterviews(interviewerId);
            res.status(200).json({ interviews });

        } catch (error) {
            throw error;
        }
    }

    // schedule an interview
    static async scheduleInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body.applicationId ||
                !req.body.interviewerId ||
                !req.body.managerId ||
                !req.body.scheduledAt
            ) throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');

            const { applicationId, interviewerId, managerId, scheduledAt } = req.body;

            if (isNaN(Date.parse(scheduledAt)) ||
                Date.parse(scheduledAt) < (Date.now() - 120000)
            ) throw badRequestError('invalid date', 'INVALID_DATE');

            const scheduledBy = req.userInfo.sub as string;

            const newInterview = {
                applicationId: applicationId.trim(),
                interviewerId: interviewerId.trim(),
                managerId: managerId.trim(),
                scheduledAt: new Date(scheduledAt),
                scheduledBy
            };

            for (const key of Object.keys(newInterview) as Array<keyof typeof newInterview>)
                if (typeof newInterview[key] === 'string' && newInterview[key].length === 0) {
                    throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
                }

            const newInterviewScheduled = await scheduleInterview(newInterview);

            if (newInterviewScheduled) {
                res.status(201).json(newInterviewScheduled);
            }

        } catch (error) {
            throw error;
        }
    }

    // get all scheduled interviews
    static async getAllInterviews(_req: Request, res: Response): Promise<void> {
        try {
            const scheduledInterviews = await getAllInterviews();
            res.status(200).json({ scheduledInterviews });

        } catch (error) {
            throw error;
        }
    }

    // get interview by id
    static async getInterviewById(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const interviewId = req.params.interviewId as string;

            const interview = await getInterviewById(interviewId);
            res.status(200).json({ interview });

        } catch (error) {
            throw error;
        }
    }

    // get all interviews by job id
    static async getInterviewsByJobId(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.jobId) throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            const jobId = req.params.jobId as string;

            const interviews = await getInterviewsByJobId(jobId);
            res.status(200).json({ interviews });

        } catch (error) {
            throw error;
        }
    }

    // update interview details
    static async updateExistingInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const interviewId = req.params.interviewId as string;

            const { interviewerId, managerId, scheduledAt, status } = req.body;

            const fieldsToUpdate: Record<string, string | Date> = {};
            if (interviewerId) fieldsToUpdate.interviewerId = interviewerId.trim();
            if (managerId) fieldsToUpdate.managerId = managerId.trim();
            if (scheduledAt) fieldsToUpdate.scheduledAt = new Date(scheduledAt);
            if (status) fieldsToUpdate.status = status;

            if (Object.keys(fieldsToUpdate).length === 0) {
                throw badRequestError('no input provided', 'NO_INPUT');
            }

            const updatedInterview = await updateExistingInterview(interviewId, fieldsToUpdate);
            res.status(200).json(updatedInterview);

        } catch (error) {
            throw error;
        }
    }

    // submit interview result + status: completed + update respective jobApplication status
    static async submitInterviewResult(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const interviewId = req.params.interviewId as string;

            const { result } = req.body;
            if (!result || !['passed', 'failed'].includes(result)) {
                throw badRequestError('result must be passed or failed', 'INVALID_RESULT');
            }

            const response = await submitInterviewResult(interviewId, result as 'passed' | 'failed');
            res.status(200).json(response);

        } catch (error) {
            throw error;
        }
    }

    // cancel an interview
    static async cancelInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const interviewId = req.params.interviewId as string;

            const response = await cancelInterview(interviewId);
            res.status(200).json(response);

        } catch (error) {
            throw error;
        }
    }

    // get interviews for the logged-in candidate
    static async getCandidateInterviews(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const interviews = await getCandidateInterviews(userId);
            res.status(200).json({ interviews });
        } catch (error) {
            throw error;
        }
    }


    // delete an interview
    static async deleteExistingInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) {
                throw badRequestError('missing required field', 'MISSING_REQUIRED_FIELD');
            }
            const interviewId = req.params.interviewId as string;

            const deleteInterview = await deleteExistingInterview(interviewId);
            if (deleteInterview) res.status(204).send();

        } catch (error) {
            throw error;
        }
    }
}
