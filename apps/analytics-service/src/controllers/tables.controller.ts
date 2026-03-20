import { Request, Response } from "express";
import { badRequestError } from '@talentsync/types';
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
                throw badRequestError('invalid date range', 'INVALID_DATE_RANGE');
            }

            const tableData = await getAllTableData(fromDate, toDate, jobId);
            res.status(200).json({ tableData });
        } catch (error) {
            throw error;
        }
    }
}