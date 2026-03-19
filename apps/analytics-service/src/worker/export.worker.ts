import { connectRabbitMQ, consumeQueue, gracefulShutdown } from '../config/rabbitmq';
import { config } from '../config/env';
import { processExportReport } from '../services/export.service';
import type { ExportReportQueueMessage } from '../types/Export.type';
import { logger } from '@talentsync/config';

const startExportWorker = async (): Promise<void> => {
  await connectRabbitMQ();

  await consumeQueue(config.queues.exportReport, async (message: ExportReportQueueMessage) => {
    await processExportReport(message);
  });

  logger.info('[analytics-export-worker] listening for export jobs');
};

process.on('SIGINT', async () => {
  await gracefulShutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await gracefulShutdown();
  process.exit(0);
});

startExportWorker().catch((error) => {
  logger.error(`[analytics-export-worker] failed to start: ${error}`);
  process.exit(1);
});
