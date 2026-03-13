import { Request, Response } from "express";
import { getAllTableData } from "../services/tables.service";
import { getDefaultDateRange } from "../utils/getDefaultDateRange";

const isValidDateOnly = (value: string) => !Number.isNaN(Date.parse(value));

export class Tables {
    static async getAllTableData(req: Request, res: Response) {
        try {
            const defaults = getDefaultDateRange();
            const fromDate = String(req.query.fromDate ?? defaults.fromDate);
            const toDate = String(req.query.toDate ?? defaults.toDate);
            const jobId = req.query.jobId ? String(req.query.jobId) : undefined;

            if (!isValidDateOnly(fromDate) || !isValidDateOnly(toDate)) {
                res.status(400).json({ error: 'invalid date range' });
                return;
            }

            const tableData = await getAllTableData(fromDate, toDate, jobId);
            res.status(200).json({ tableData });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ error: errorMessage });
        }
    }
}