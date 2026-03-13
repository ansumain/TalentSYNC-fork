interface InterviewerPerformanceRow {
    interviewerId: string;
    interviewerName: string;
    totalInterviews: number;
    passedCount: number;
    failedCount: number;
    passRate: number;
}

interface FunnelData {
    jobId: string | 'all';
    jobTitle: string;
    applied: number;
    shortlisted: number;
    selected: number;
    hired: number;
    timeToHireDays: number;
    conversionRate: number;
}

interface Tables {
    funnel: FunnelData;
    interviewerPerformance: InterviewerPerformanceRow[];
    lastUpdatedAt: string | null;
}

export type { Tables };