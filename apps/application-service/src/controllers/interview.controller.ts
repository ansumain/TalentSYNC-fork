import { Request, Response } from 'express';
import {
    getAvailableInterviewers,
    scheduleInterview,
    getAllInterviews,
    getInterviewById,
    getInterviewsByJobId,
    getAssignedInterviews,
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

            if (!date || !applicationId) throw new Error('missing required field');

            const availableInterviewers = await getAvailableInterviewers(date, applicationId);
            res.status(200).json({ availableInterviewers });

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    // get all assigned interviews
    static async getAssignedInterviews(req: Request, res: Response): Promise<void> {
        try {
            const interviewerId = req.userInfo.sub as string;
            const interviews = await getAssignedInterviews(interviewerId);
            res.status(200).json({ interviews });

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }

    // schedule an interview
    static async scheduleInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body.applicationId ||
                !req.body.interviewerId ||
                !req.body.managerId ||
                !req.body.scheduledAt
            ) throw new Error('missing required field');

            const { applicationId, interviewerId, managerId, scheduledAt } = req.body;

            if (isNaN(Date.parse(scheduledAt)) ||
                Date.parse(scheduledAt) < (Date.now() - 120000)
            ) throw new Error('invalid date');

            const scheduledBy = req.userInfo.sub as string;

            const newInterview = {
                applicationId: applicationId.trim(),
                interviewerId: interviewerId.trim(),
                managerId: managerId.trim(),
                scheduledAt: new Date(scheduledAt),
                scheduledBy
            };

            for (const key of Object.keys(newInterview) as Array<keyof typeof newInterview>)
                if (typeof newInterview[key] === 'string' && newInterview[key].length === 0) throw new Error('missing required field');

            const newInterviewScheduled = await scheduleInterview(newInterview);

            if (newInterviewScheduled) {
                res.status(201).json(newInterviewScheduled);
            }

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('invalid date')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('application not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('interview already exists')) {
                res.status(409).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    // get all scheduled interviews
    static async getAllInterviews(req: Request, res: Response): Promise<void> {
        try {
            const scheduledInterviews = await getAllInterviews();
            res.status(200).json({ scheduledInterviews });

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('interviews not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }

            res.status(500).json({ error: errorMessage });
        }
    }

    // get interview by id
    static async getInterviewById(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) throw new Error('missing required field');
            const interviewId = req.params.interviewId as string;

            const interview = await getInterviewById(interviewId);
            res.status(200).json({ interview });

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('interview not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    // get all interviews by job id
    static async getInterviewsByJobId(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.jobId) throw new Error('missing required field');
            const jobId = req.params.jobId as string;

            const interviews = await getInterviewsByJobId(jobId);
            res.status(200).json({ interviews });

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    // update interview details
    static async updateExistingInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) throw new Error('missing required field');
            const interviewId = req.params.interviewId as string;

            const { interviewerId, managerId, scheduledAt, status } = req.body;

            const fieldsToUpdate: Record<string, string | Date> = {};
            if (interviewerId) fieldsToUpdate.interviewerId = interviewerId.trim();
            if (managerId) fieldsToUpdate.managerId = managerId.trim();
            if (scheduledAt) fieldsToUpdate.scheduledAt = new Date(scheduledAt);
            if (status) fieldsToUpdate.status = status;

            if (Object.keys(fieldsToUpdate).length === 0) throw new Error('no input provided');

            const updatedInterview = await updateExistingInterview(interviewId, fieldsToUpdate);
            res.status(200).json(updatedInterview);

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('no input provided') ||
                errorMessage.includes('missing required field') ||
                errorMessage.includes('cannot update a completed interview') ||
                errorMessage.includes('cannot update') ||
                errorMessage.includes('can only reschedule') ||
                errorMessage.includes('can only reschedule a cancelled interview')
            ) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('interview not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    // submit interview result + status: completed + update respective jobApplication status
    static async submitInterviewResult(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) throw new Error('missing required field');
            const interviewId = req.params.interviewId as string;

            const { result } = req.body;
            if (!result || !['passed', 'failed'].includes(result)) {
                throw new Error('result must be passed or failed');
            }

            const response = await submitInterviewResult(interviewId, result as 'passed' | 'failed');
            res.status(200).json(response);

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('missing required field') ||
                errorMessage.includes('result must be passed or failed') ||
                errorMessage.includes('can only submit result for a scheduled interview')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('interview not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }

    // cancel an interview
    static async cancelInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) throw new Error('missing required field');
            const interviewId = req.params.interviewId as string;

            const response = await cancelInterview(interviewId);
            res.status(200).json(response);

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('missing required field') ||
                errorMessage.includes('cannot cancel a completed interview') ||
                errorMessage.includes('interview is already cancelled')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('interview not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }

            res.status(500).json({ error: errorMessage });
        }
    }

    // delete an interview
    static async deleteExistingInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) throw new Error('missing required field');
            const interviewId = req.params.interviewId as string;

            const deleteInterview = await deleteExistingInterview(interviewId);
            if (deleteInterview) res.status(204).send();

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            if (errorMessage.includes('interview not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }
}
