import { Request, Response } from "express";
import { badRequestError } from '@talentsync/types';
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
                throw badRequestError('invalid date range', 'INVALID_DATE_RANGE');
            }

            if (![3, 5, 10].includes(topInput)) {
                throw badRequestError('top must be 3, 5, or 10', 'INVALID_TOP_VALUE');
            }

            const graphData = await getAllGraphData(fromDate, toDate, topInput as 3 | 5 | 10);
            res.status(200).json({ graphData });
        } catch (error) {
            throw error;
        }
    }
}