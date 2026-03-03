import { Request, Response } from 'express';
import {
    scheduleInterview,
    getAllInterviews, 
    getInterviewById, 
    getInterviewsByJobId,
    updateExistingInterview,
} from '../services/interview.service';
import { CreateInterview } from '../types/CreateInterview.type';

export class InterviewController {

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

            const scheduledBy = req.userInfo.sub;


            const newInterview = {
                applicationId: applicationId.trim(),
                interviewerId: interviewerId.trim(),
                managerId: managerId.trim(),
                scheduledAt: new Date(scheduledAt),
                scheduledBy
            }

            for (const key of Object.keys(newInterview) as Array<keyof typeof newInterview>)
                if (typeof newInterview[key] === 'string' && newInterview[key].length === 0) throw new Error('missing required field');

            const newInterviewScheduled = await scheduleInterview(newInterview);

            if (newInterviewScheduled) {
                res.status(201).json(newInterviewScheduled);
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

            if (errorMessage.includes('missing required field')) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            
            if (errorMessage.includes('invalid date')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            if (errorMessage.includes('interview already exists')) {
                res.status(400).json({ error: errorMessage });
                return;
            }

            res.status(500).json({ error: errorMessage });
        }
    }

    static async getAllInterviews(req: Request, res: Response): Promise<void> {
        try {
            const scheduledInterviews = await getAllInterviews();

            if (scheduledInterviews) {
                res.status(200).json({ scheduledInterviews });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }

    static async getInterviewById(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.interviewId) throw new Error('missing required field');
            const interviewId = req.params.interviewId as string;

            const interview = await getInterviewById(interviewId);

            if (interview) {
                res.status(200).json({ interview });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

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

    static async getInterviewsByJobId(req: Request, res: Response): Promise<void> {
        try {

            if (!req.params.jobId) throw new Error('missing required field');
            const jobId = req.params.jobId as string;

            const interviews = await getInterviewsByJobId(jobId);

            if (interviews) {
                res.status(200).json({ interviews });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';

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

    static async updateExistingInterview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.interviewId) throw new Error('missing required field');
            const interviewId = req.params.interviewId as string;

            const { interviewerId, managerId } = req.body;

            let fieldsToUpdate: Partial<CreateInterview> = {};
            if (interviewerId) fieldsToUpdate.interviewerId = interviewerId.trim();
            if (managerId) fieldsToUpdate.managerId = managerId.trim();

            if (Object.keys(fieldsToUpdate).length === 0) throw new Error('no input');

            const updatedInterview = await updateExistingInterview(interviewId, fieldsToUpdate);

            if (updatedInterview) {
                res.status(200).json(updatedInterview);
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

            if (errorMessage.includes('interview not found')) {
                res.status(404).json({ error: errorMessage });
                return;
            }
            res.status(500).json({ error: errorMessage });
        }
    }
}
