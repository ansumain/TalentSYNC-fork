interface Counters {
    interviews: {
        scheduled: number;
        completed: number;
        cancelled: number;
        noShow: number;
    },
    openJobs: number;
    hires: number;
    lastUpdatedAt: string | null;
}

export type { Counters };