import { Request, Response } from "express";
import { badRequestError } from '@talentsync/types';
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
                throw badRequestError('invalid date range', 'INVALID_DATE_RANGE');
            }

            const counterData = await getAllCounterData(fromDate, toDate);
            res.status(200).json({ counterData });
        } catch (error) {
            throw error;
        }
    }
}