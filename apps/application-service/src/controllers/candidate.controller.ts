import { Request, Response } from 'express';
import { getCandiateParsedData, getCandidateDataFromName } from '../services/candidate.service';

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
            const { name } = req.body;
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
}
