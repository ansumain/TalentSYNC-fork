type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'noshow';
type InterviewResult = 'passed' | 'failed';

interface Interview {
    interviewId: string;
    applicationId: string;
    interviewerId: string;
    managerId: string;
    scheduledAt: string;
    scheduledBy: string;
    status: InterviewStatus;
    result: InterviewResult | null;
    createdAt: string;
    updatedAt: string;
}

interface AvailableInterviewer {
    id: string;
    name: string;
    email: string;
}

export type { Interview, AvailableInterviewer }