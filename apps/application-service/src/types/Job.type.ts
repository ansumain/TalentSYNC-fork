interface CreateJob {
    title: string;
    description: string;
    location: string;
    jobType: string;
    openings: number;
    createdBy: string;
    skillIds?: string[];
}

export type { CreateJob }