import { Request, Response } from "express";
import { getDefaultDateRange } from "../utils/getDefaultDateRange";
import { getAllGraphData } from "../services/graphs.service";

const isValidDateOnly = (value: string) => !Number.isNaN(Date.parse(value));

export class Graphs {
    static async getAllGraphData(req: Request, res: Response) {
        try {
            const defaults = getDefaultDateRange();
            const fromDate = String(req.query.fromDate ?? defaults.fromDate);
            const toDate = String(req.query.toDate ?? defaults.toDate);
            const topInput = Number(req.query.top ?? 5);

            if (!isValidDateOnly(fromDate) || !isValidDateOnly(toDate)) {
                res.status(400).json({ error: 'invalid date range' });
                return;
            }

            if (![3, 5, 10].includes(topInput)) {
                res.status(400).json({ error: 'top must be 3, 5, or 10' });
                return;
            }

            const graphData = await getAllGraphData(fromDate, toDate, topInput as 3 | 5 | 10);
            res.status(200).json({ graphData });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ error: errorMessage });
        }
    }
}