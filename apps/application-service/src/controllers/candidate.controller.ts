import { Request, Response } from 'express';
import { getCandiateParsedData, getCandidateDataFromResumeId, getCandidateDataFromUserId, getMyResumeStatus, getMyResumes } from '../services/candidate.service';
import { parsePaginationParams } from '../utils/parsePaginationParams';

export class CandidateController {
    static async getMyResumeStatus(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub;
            const hasResume = await getMyResumeStatus(userId);
            res.status(200).json({ hasResume });
        } catch (e: any) {
            res.status(500).json({ error: e.message || 'Internal server error' });
        }
    }

    static async getCandidateJSONData(req: Request, res: Response): Promise<void> {
        try {
            const params = parsePaginationParams(req.query);
            const result = await getCandiateParsedData(params);
            res.status(200).json({
                candidateJSONData: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            });
        } catch (e: any) {
            res.status(500).json({ error: e.message || 'Internal server error' });
        }
    }

    static async getCandidateDataFromUserId(req: Request, res: Response): Promise<void> {
        try {
            const roleName = req.userInfo.role.name;
            if (roleName === 'candidate') {
                res.status(403).json({ error: 'Access denied.' });
                return;
            }
            const userId = req.query.userId as string;
            if (!userId) {
                res.status(400).json({ error: 'userId is required' });
                return;
            }
            const candidateData = await getCandidateDataFromUserId(userId);

            if (candidateData) {
                res.status(200).json({
                    candidateData
                });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }

    static async getMyResumes(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub;
            const resumes = await getMyResumes(userId);
            res.status(200).json({ resumes });
        } catch (e: any) {
            res.status(500).json({ error: e.message || 'Internal server error' });
        }
    }

    static async getCandidateDataFromResumeId(req: Request, res: Response): Promise<void> {
        try {
            const { resumeId } = req.body;
            const candidateData = await getCandidateDataFromResumeId(resumeId);

            if (candidateData) {
                res.status(200).json({
                    candidateData
                });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }
}
