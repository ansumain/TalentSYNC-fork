import { create } from 'zustand';
import { candidateService, type Candidate } from '@/lib/api/application.service';

export interface EducationEntry {
  name: string;
  batch: string;
}

export interface ExperienceEntry {
  company: string;
  designation: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
}

// export interface Candidate {
//   userId: string;
//   id: string;
//   fileName: string | null;
//   fileURL: string | null;
//   status: string | null;
//   parsedJSON: {
//     name: string | null;
//     email: string | null;
//     phone: string | null;
//     education: EducationEntry[];
//     skills: string[];
//     experience: ExperienceEntry[];
//     totalExperience: number;
//   };
//   createdAt: string;
// }

export type CandidateFilterType = 'none' | 'name' | 'userId' | 'resumeId';

interface CandidateStore {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  filterType: CandidateFilterType;
  filterValue: string;
  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  // Actions
  fetchAll: () => Promise<void>;
  filterByName: (name: string) => Promise<void>;
  filterByUserId: (userId: string) => Promise<void>;
  filterByResumeId: (resumeId: string) => Promise<void>;
  clearFilter: () => void;
  setPage: (page: number) => Promise<void>;
  setSort: (column: string) => Promise<void>;
  setLimit: (limit: number) => Promise<void>;
}

export const useCandidateStore = create<CandidateStore>((set, get) => {
  const doFetch = async () => {
    const { page, limit, sortBy, sortOrder, filterType, filterValue } = get();
    const search = filterType === 'name' && filterValue ? filterValue : undefined;
    set({ loading: true, error: null });
    try {
      const res = await candidateService.getAllCandidates({ page, limit, sortBy, sortOrder, search });
      set({ candidates: res.candidateJSONData, total: res.total, totalPages: res.totalPages, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch candidates', loading: false });
    }
  };

  return {
    candidates: [],
    loading: false,
    error: null,
    filterType: 'none',
    filterValue: '',
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',

    fetchAll: async () => {
      set({ filterType: 'none', filterValue: '', page: 1 });
      await doFetch();
    },

    filterByName: async (name) => {
      set({ filterType: 'name', filterValue: name, page: 1 });
      await doFetch();
    },

    filterByUserId: async (userId) => {
      set({ loading: true, error: null, filterType: 'userId', filterValue: userId });
      try {
        const res = await candidateService.filterCandidatesByUserId(userId);
        set({ candidates: res.candidateData as Candidate[], total: res.total ?? 0, totalPages: res.totalPages ?? 1, loading: false });
      } catch (err: any) {
        set({ error: err.message || 'Failed to filter candidates', loading: false });
      }
    },

    filterByResumeId: async (resumeId) => {
      set({ loading: true, error: null, filterType: 'resumeId', filterValue: resumeId });
      try {
        const res = await candidateService.filterCandidatesByResumeId(resumeId);
        set({ candidates: res.candidateData as Candidate[], total: res.total ?? 0, totalPages: res.totalPages ?? 1, loading: false });
      } catch (err: any) {
        set({ error: err.message || 'Failed to filter candidates', loading: false });
      }
    },

    clearFilter: () => {
      set({ filterType: 'none', filterValue: '' });
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
