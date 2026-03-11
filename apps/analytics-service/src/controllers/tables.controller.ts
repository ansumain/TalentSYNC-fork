import { Request, Response } from "express";
import { getAllTableData } from "../services/tables.service";

export class Tables {
    static async getAllTableData(req: Request, res: Response) {
        try {
            const tableData = await getAllTableData();
            res.status(200).json({ tableData });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ error: errorMessage });
        }
    }
}