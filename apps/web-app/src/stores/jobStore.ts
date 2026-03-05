import { create } from 'zustand';
import { jobService } from '@/lib/api/application.service';

export interface Job {
  jobId: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  openings: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateJobPayload {
  title: string;
  description: string;
  location: string;
  jobType: string;
  openings: number;
  skillIds: string[];
}

interface JobStore {
  jobs: Job[];
  allJobs: Job[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  filterByTitle: (title: string) => void;
  clearFilter: () => void;
  createJob: (data: CreateJobPayload) => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  allJobs: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const res = await jobService.getAllJobs();
      set({ jobs: res.currentJobs, allJobs: res.currentJobs, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch jobs', loading: false });
    }
  },

  filterByTitle: (title: string) => {
    const { allJobs } = get();
    const filtered = allJobs.filter(j =>
      j.title.toLowerCase().includes(title.toLowerCase())
    );
    set({ jobs: filtered });
  },

  clearFilter: () => {
    const { allJobs } = get();
    set({ jobs: allJobs });
  },

  createJob: async (data: CreateJobPayload) => {
    await jobService.createJob(data);
    await get().fetchAll();
  },
}));
