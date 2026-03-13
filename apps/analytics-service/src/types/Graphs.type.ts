interface SkillGapPoint {
    skillId: string;
    skillName: string;
    demandCount: number;
    supplyCount: number;
}

interface JobApplicationsPoint {
    jobId: string;
    jobTitle: string;
    applicationCount: number;
}

interface Graphs {
    skillGapBar: SkillGapPoint[];
    jobApplicationsPie: JobApplicationsPoint[];
    top: 3 | 5 | 10;
    lastUpdatedAt: string | null;
}

export type { Graphs };