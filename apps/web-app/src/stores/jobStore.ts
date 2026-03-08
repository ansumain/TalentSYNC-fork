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
  loading: boolean;
  error: string | null;
  search: string;
  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  // Actions
  fetchAll: () => Promise<void>;
  filterByTitle: (title: string) => Promise<void>;
  clearFilter: () => Promise<void>;
  createJob: (data: CreateJobPayload) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  setPage: (page: number) => Promise<void>;
  setSort: (column: string) => Promise<void>;
  setLimit: (limit: number) => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => {
  const doFetch = async () => {
    const { page, limit, sortBy, sortOrder, search } = get();
    set({ loading: true, error: null });
    try {
      const res = await jobService.getAllJobs({ page, limit, sortBy, sortOrder, search: search || undefined });
      set({ jobs: res.currentJobs, total: res.total, totalPages: res.totalPages, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch jobs', loading: false });
    }
  };

  return {
    jobs: [],
    loading: false,
    error: null,
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',

    fetchAll: async () => {
      set({ search: '', page: 1 });
      await doFetch();
    },

    filterByTitle: async (title) => {
      set({ search: title, page: 1 });
      await doFetch();
    },

    clearFilter: async () => {
      set({ search: '', page: 1 });
      await doFetch();
    },

    createJob: async (data) => {
      await jobService.createJob(data);
      set({ search: '', page: 1 });
      await doFetch();
    },

    deleteJob: async (jobId) => {
      await jobService.deleteJob(jobId);
      const { jobs } = get();
      set({ jobs: jobs.filter(j => j.jobId !== jobId) });
      // Refresh the count from backend
      await doFetch();
    },

    setPage: async (page) => {
      set({ page });
      await doFetch();
    },

    setSort: async (column) => {
      const { sortBy, sortOrder } = get();
      const newOrder = column === sortBy ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
      set({ sortBy: column, sortOrder: newOrder, page: 1 });
      await doFetch();
    },

    setLimit: async (limit) => {
      set({ limit, page: 1 });
      await doFetch();
    },
  };
});
