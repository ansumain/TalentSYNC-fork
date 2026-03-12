interface Counters {
    interviews: {
        scheduled: number;
        completed: number;
        cancelled: number;
        noShow: number;
    },
    jobs: number;
    hires: number;
}

export type { Counters };