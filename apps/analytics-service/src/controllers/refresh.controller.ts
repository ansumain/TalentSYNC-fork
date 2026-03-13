import { Request, Response } from 'express';
import { getLatestRefreshStatus, runAnalyticsRefresh } from '../services/refresh.service';

export class RefreshController {
    static async triggerManualRefresh(_req: Request, res: Response) {
        try {
            const result = await runAnalyticsRefresh('manual', 'manual refresh requested by admin');
            res.status(200).json({
                message: 'analytics refresh completed',
                refreshId: result.refreshId,
                date: result.date,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ error: errorMessage });
        }
    }

    static async getLatestRefreshStatus(_req: Request, res: Response) {
        try {
            const latest = await getLatestRefreshStatus();
            res.status(200).json({ latest });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ error: errorMessage });
        }
    }
}
