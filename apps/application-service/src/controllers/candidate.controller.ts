import { Request, Response } from 'express';
import { getCandiateParsedData, getCandidateDataFromName, getCandidateDataFromResumeId, getCandidateDataFromUserId } from '../services/candidate.service';

export class CandidateController {
    static async getCandidateJSONData(req: Request, res: Response): Promise<void> {
        try {
            const candidateJSONData = await getCandiateParsedData();

            if (candidateJSONData) {
                res.status(200).json({
                    candidateJSONData
                });
            }

        } catch (e: any) {
            const errorMessage = e.message || 'Internal server error';
            res.status(500).json({ error: errorMessage });
        }
    }

    static async getCandidateDataFromName(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.query;

            if(!name || typeof name !== 'string'){
                res.status(400).json({
                    error: 'name query param required'
                });
                return;
            }
            const candidateData = await getCandidateDataFromName(name);

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

    static async getCandidateDataFromUserId(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
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
