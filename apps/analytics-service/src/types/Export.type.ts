type ExportFormat = 'pdf' | 'xlsx';

interface ExportFilters {
  fromDate: string;
  toDate: string;
  jobId?: string;
  top?: 3 | 5 | 10;
}

interface ExportReportQueueMessage {
  requestedByUserId: string;
  format: ExportFormat;
  filters: ExportFilters;
  requestedAt: string;
}

interface AggregatedReportSnapshot {
  filters: ExportFilters;
  generatedAt: string;
  counters: {
    interviews: {
      scheduled: number;
      completed: number;
      cancelled: number;
      noShow: number;
    };
    openJobs: number;
    hires: number;
    lastUpdatedAt: string | null;
  };
  graphs: {
    skillGapBar: Array<{
      skillId: string;
      skillName: string;
      demandCount: number;
      supplyCount: number;
    }>;
    jobApplicationsPie: Array<{
      jobId: string;
      jobTitle: string;
      applicationCount: number;
    }>;
    top: 3 | 5 | 10;
    lastUpdatedAt: string | null;
  };
  tables: {
    funnel: {
      jobId: string | 'all';
      jobTitle: string;
      applied: number;
      shortlisted: number;
      selected: number;
      hired: number;
      timeToHireDays: number;
      conversionRate: number;
    };
    interviewerPerformance: Array<{
      interviewerId: string;
      interviewerName: string;
      totalInterviews: number;
      passedCount: number;
      failedCount: number;
      passRate: number;
    }>;
    lastUpdatedAt: string | null;
  };
}

export type { ExportFormat, ExportFilters, ExportReportQueueMessage, AggregatedReportSnapshot };
