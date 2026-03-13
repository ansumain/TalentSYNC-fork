import { config } from '../config/env';
import { publishToQueue } from '../config/rabbitmq';
import { getUserEmailByIdRepository } from '../repository/export.repository';
import { getAllCounterDataRepository } from '../repository/counters.repository';
import { getAllGraphDataRepository } from '../repository/graphs.repository';
import { getAllTableDataRepository } from '../repository/tables.repository';
import { generateExcelBuffer, generatePdfBuffer } from './reportGenerator.service';
import { sendExportEmail } from './exportEmail.service';
import type { AggregatedReportSnapshot, ExportFilters, ExportFormat, ExportReportQueueMessage } from '../types/Export.type';

const getDefaultDateRange = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    fromDate: firstDayOfMonth.toISOString().slice(0, 10),
    toDate: now.toISOString().slice(0, 10),
  };
};

const isValidDateOnly = (value: string) => !Number.isNaN(Date.parse(value));

const normalizeFilters = (input: Partial<ExportFilters>): ExportFilters => {
  const defaults = getDefaultDateRange();
  const fromDate = input.fromDate ?? defaults.fromDate;
  const toDate = input.toDate ?? defaults.toDate;

  if (!isValidDateOnly(fromDate) || !isValidDateOnly(toDate)) {
    throw new Error('invalid date range');
  }

  const top = [3, 5, 10].includes(Number(input.top)) ? (Number(input.top) as 3 | 5 | 10) : 5;

  return {
    fromDate,
    toDate,
    jobId: input.jobId && input.jobId !== 'all' ? input.jobId : undefined,
    top,
  };
};

const enqueueExportReport = async (
  requestedByUserId: string,
  format: ExportFormat,
  filtersInput: Partial<ExportFilters>
): Promise<void> => {
  const filters = normalizeFilters(filtersInput);

  const payload: ExportReportQueueMessage = {
    requestedByUserId,
    format,
    filters,
    requestedAt: new Date().toISOString(),
  };

  await publishToQueue(config.queues.exportReport, payload, 0);
};

const buildAggregatedReportSnapshot = async (filters: ExportFilters): Promise<AggregatedReportSnapshot> => {
  const counters = await getAllCounterDataRepository(filters.fromDate, filters.toDate);
  const graphs = await getAllGraphDataRepository(filters.fromDate, filters.toDate, filters.top ?? 5);
  const tables = await getAllTableDataRepository(filters.fromDate, filters.toDate, filters.jobId);

  return {
    filters,
    generatedAt: new Date().toISOString(),
    counters,
    graphs,
    tables,
  };
};

const processExportReport = async (message: ExportReportQueueMessage): Promise<void> => {
  const filters = normalizeFilters(message.filters);
  const snapshot = await buildAggregatedReportSnapshot(filters);

  const buffer =
    message.format === 'pdf'
      ? await generatePdfBuffer(snapshot)
      : await generateExcelBuffer(snapshot);

  const userEmail = await getUserEmailByIdRepository(message.requestedByUserId);
  const fileName = `analytics-report-${new Date().toISOString().slice(0, 10)}.${message.format}`;

  await sendExportEmail(userEmail, message.format, buffer, fileName);
};

export { enqueueExportReport, processExportReport };