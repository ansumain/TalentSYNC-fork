import type { JobAttributes, JobApplicationAttributes } from '@talentsync/models';

interface ApplicationWithJob extends JobApplicationAttributes {
    createdAt: Date | string;
    updatedAt: Date | string;
    job: Pick<JobAttributes, 'jobId' | 'title' | 'location' | 'jobType'> | null;
}

interface RankedApplicant {
    applicationId: string;
    userId: string;
    resumeId: string | null;
    currentStatus: string;
    appliedAt: Date | string;
    candidateName: string | null;
    candidateSkills: string[];
    matchedSkills: string[];
    matchCount: number;
    rank: number;
}

interface EnrichedApplication extends JobApplicationAttributes {
    createdAt: Date | string;
    updatedAt: Date | string;
    candidateName: string | null;
    jobTitle: string | null;
}

export type { ApplicationWithJob, RankedApplicant, EnrichedApplication };