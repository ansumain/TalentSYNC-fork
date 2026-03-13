export type AnalyticsTop = 3 | 5 | 10;

export interface AnalyticsCounters {
  interviews: {
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  openJobs: number;
  hires: number;
  lastUpdatedAt: string | null;
}

export interface AnalyticsGraphs {
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
  top: AnalyticsTop;
  lastUpdatedAt: string | null;
}

export interface AnalyticsTables {
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
}

export interface ExportRequestPayload {
  format: 'pdf' | 'xlsx';
  fromDate: string;
  toDate: string;
  jobId?: string;
  top?: AnalyticsTop;
}

export interface AnalyticsRefreshStatus {
  refreshId: number;
  startedAt: string;
  completedAt: string | null;
  status: 'running' | 'success' | 'failed';
  triggeredBy: 'cron' | 'manual';
  notes: string | null;
}
