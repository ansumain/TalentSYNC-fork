import { Request, Response } from "express";
import { getAllGraphData } from "../services/graphs.service";

export class Graphs {
    static async getAllGraphData(req: Request, res: Response) {
        try {
            const graphData = await getAllGraphData();
            res.status(200).json({ graphData });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ error: errorMessage });
        }
    }
}