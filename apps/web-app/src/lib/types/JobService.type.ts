import type { Skill } from "./SkillService.type";
import type { PaginationMeta } from "./Pagination.type";

interface Job {
    jobId: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
    openings: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    skills?: Skill[];
}

type ApplicationStatus = 'applied' | 'shortlisted' | 'interviewing' | 'selected' | 'rejected' | 'hired' | 'offerRejected'

interface JobApplication {
    applicationId: string;
    userId: string;
    jobId: string;
    currentStatus: ApplicationStatus;
    createdAt: string;
    updatedAt: string;

    candidateName?: string | null;
    jobTitle?: string | null;

    job?: Pick<Job, 'jobId' | 'title' | 'location' | 'jobType'>;
}

interface RankedApplicant {
    applicationId: string;
    userId: string;
    resumeId: string | null;
    currentStatus: ApplicationStatus;
    appliedAt: string;
    candidateName: string | null;
    candidateSkills: string[];
    matchedSkills: string[];
    matchCount: number;
    rank: number;
}

interface GetAllJobsResponse extends PaginationMeta {
    currentJobs: Job[];
}

interface GetJobByIdResponse {
    job: Job;
}

export type { Job, JobApplication, RankedApplicant, GetAllJobsResponse, GetJobByIdResponse, ApplicationStatus };