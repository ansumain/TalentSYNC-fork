import { Request, Response } from 'express';
import { getCandiateParsedData } from '../services/candidate.service';

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
}
