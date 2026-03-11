import { Request, Response } from "express";
import { getAllCounterData } from "../services/counters.service";

export class Counters {
    static async getAllCounterData(req: Request, res: Response) {
        try {
            const counterData = await getAllCounterData();
            res.status(200).json({ counterData });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ error: errorMessage });
        }
    }
}