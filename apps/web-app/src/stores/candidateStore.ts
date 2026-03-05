import { create } from 'zustand';
import { applicationService } from '@/lib/api/application.service';

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

export interface Candidate {
  userId: string;
  id: string;
  parsedJSON: {
    name: string | null;
    email: string | null;
    phone: string | null;
    education: EducationEntry[];
    skills: string[];
    experience: ExperienceEntry[];
    totalExperience: number;
  };
  createdAt: string;
}

export type CandidateFilterType = 'none' | 'name' | 'userId' | 'resumeId';

interface CandidateStore {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  filterType: CandidateFilterType;
  filterValue: string;
  fetchAll: () => Promise<void>;
  filterByName: (name: string) => Promise<void>;
  filterByUserId: (userId: string) => Promise<void>;
  filterByResumeId: (resumeId: string) => Promise<void>;
  clearFilter: () => void;
}

export const useCandidateStore = create<CandidateStore>((set) => ({
  candidates: [],
  loading: false,
  error: null,
  filterType: 'none',
  filterValue: '',

  fetchAll: async () => {
    set({ loading: true, error: null, filterType: 'none', filterValue: '' });
    try {
      const res = await applicationService.getAllCandidates();
      set({ candidates: res.candidateJSONData, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch candidates', loading: false });
    }
  },

  filterByName: async (name) => {
    set({ loading: true, error: null, filterType: 'name', filterValue: name });
    try {
      const res = await applicationService.filterCandidatesByName(name);
      set({ candidates: res.candidateData, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to filter candidates', loading: false });
    }
  },

  filterByUserId: async (userId) => {
    set({ loading: true, error: null, filterType: 'userId', filterValue: userId });
    try {
      const res = await applicationService.filterCandidatesByUserId(userId);
      set({ candidates: res.candidateData, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to filter candidates', loading: false });
    }
  },

  filterByResumeId: async (resumeId) => {
    set({ loading: true, error: null, filterType: 'resumeId', filterValue: resumeId });
    try {
      const res = await applicationService.filterCandidatesByResumeId(resumeId);
      set({ candidates: res.candidateData, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to filter candidates', loading: false });
    }
  },

  clearFilter: () => {
    set({ filterType: 'none', filterValue: '' });
  },
}));
