interface RecentInterviewsTable {
    applicantName: string;
    interviewerName: string;
    result: string;
}

interface DataBoxData {
    applied: number;
    shortlisted: number;
    interviewing: number;
    selected: number;
    hired: number;

    timeToHire: string;
    conversionRate: string;
}

interface Tables {
    recentInterviewTable: RecentInterviewsTable[];
    dataBox: DataBoxData[]
}

export type { Tables };