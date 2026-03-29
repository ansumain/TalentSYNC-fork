import { Request, Response } from 'express';
import { badRequestError, forbiddenError } from '@talentsync/types';
import { getCandiateParsedData, getCandidateDataFromResumeId, getCandidateDataFromUserId, getMyResumeStatus, getMyResumes } from '../services/candidate.service';
import { parsePaginationParams } from '../utils/parsePaginationParams';

export class CandidateController {
    // check whether resume is present or not for the user
    static async getMyResumeStatus(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const hasResume = await getMyResumeStatus(userId);
            res.status(200).json({ hasResume });
        } catch (error) {
            throw error;
        }
    }

    // get candidate parsed formatted JSON data
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
        } catch (error) {
            throw error;
        }
    }

    // get candidate parsed formatted JSON data by userId
    static async getCandidateDataFromUserId(req: Request, res: Response): Promise<void> {
        try {
            const roleName = req.userInfo.role.name;
            if (roleName === 'candidate') {
                throw forbiddenError('Access denied.', 'ACCESS_DENIED');
            }
            const userId = req.query.userId as string;
            if (!userId) {
                throw badRequestError('userId is required', 'USER_ID_REQUIRED');
            }
            const candidateData = await getCandidateDataFromUserId(userId);

            if (candidateData) {
                res.status(200).json({
                    candidateData
                });
            }

        } catch (error) {
            throw error;
        }
    }

    // get user's resumes
    static async getMyResumes(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userInfo.sub as string;
            const resumes = await getMyResumes(userId);
            res.status(200).json({ resumes });
        } catch (error) {
            throw error;
        }
    }

    // get candidate parsed formatted JSON data by resumeId
    static async getCandidateDataFromResumeId(req: Request, res: Response): Promise<void> {
        try {
            // const { resumeId } = req.body;
            const resumeId = req.query.resumeId as string;
            if (!resumeId) throw badRequestError('resumeId is required', 'RESUME_ID_REQUIRED');
            const candidateData = await getCandidateDataFromResumeId(resumeId);

            if (candidateData) {
                res.status(200).json({
                    candidateData
                });
            }

        } catch (error) {
            throw error;
        }
    }
}
