import { Request, Response } from "express";
import { getAllCounterData } from "../services/counters.service";
import { getDefaultDateRange } from "../utils/getDefaultDateRange";

const isValidDateOnly = (value: string) => !Number.isNaN(Date.parse(value));

export class Counters {
    static async getAllCounterData(req: Request, res: Response) {
        try {
            const defaults = getDefaultDateRange();
            const fromDate = String(req.query.fromDate ?? defaults.fromDate);
            const toDate = String(req.query.toDate ?? defaults.toDate);

            if (!isValidDateOnly(fromDate) || !isValidDateOnly(toDate)) {
                res.status(400).json({ error: 'invalid date range' });
                return;
            }

            const counterData = await getAllCounterData(fromDate, toDate);
            res.status(200).json({ counterData });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ error: errorMessage });
        }
    }
}