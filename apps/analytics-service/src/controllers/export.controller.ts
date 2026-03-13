import { Request, Response } from 'express';
import { enqueueExportReport } from '../services/export.service';
import type { ExportFormat } from '../types/Export.type';

export class ExportController {
  static async requestExport(req: Request, res: Response) {
    try {
      const format = String(req.body?.format ?? '').toLowerCase() as ExportFormat;
      if (!['pdf', 'xlsx'].includes(format)) {
        res.status(400).json({ error: 'format must be pdf or xlsx' });
        return;
      }

      const requestedByUserId = req.userInfo.sub as string;
      await enqueueExportReport(requestedByUserId, format, {
        fromDate: req.body?.fromDate,
        toDate: req.body?.toDate,
        jobId: req.body?.jobId,
        top: req.body?.top,
      });

      res.status(202).json({
        message: 'export request queued',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      const status = errorMessage.includes('invalid date range') ? 400 : 500;
      res.status(status).json({ error: errorMessage });
    }
  }
}