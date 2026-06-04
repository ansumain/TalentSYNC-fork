import { Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';
import { enqueueExportReport } from '../services/export.service';
import type { ExportFormat } from '../types/Export.type';

export class ExportController {
  static async requestExport(req: Request, res: Response) {
    try {
      const format = String(req.body?.format ?? '').toLowerCase() as ExportFormat;
      if (!['pdf', 'xlsx'].includes(format)) {
        throw badRequestError('format must be pdf or xlsx', 'INVALID_EXPORT_FORMAT');
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
    } catch (error) {
      throw error;
    }
  }
}