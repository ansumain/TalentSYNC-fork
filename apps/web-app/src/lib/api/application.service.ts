import { apiClient } from './client';
import { API_CONFIG } from './config';

export interface Candidate {
  userId: string;
  id: string;
  parsedJSON: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  createdAt: string;
}

// Response types
interface GetAllCandidatesResponse {
  candidateJSONData: Candidate[];
}
interface FilterCandidatesResponse {
  candidateData: Candidate[];
}

export const applicationService = {
  // GET all candidates (distinct by userId)
  getAllCandidates: async (): Promise<GetAllCandidatesResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/parsed`;
    return apiClient.get<GetAllCandidatesResponse>(url);
  },

  // POST filter by name
  filterCandidatesByName: async (name: string): Promise<FilterCandidatesResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/parsed/filter/name`;
    return apiClient.post<FilterCandidatesResponse>(url, { name });
  },

  // POST filter by userId
  filterCandidatesByUserId: async (userId: string): Promise<FilterCandidatesResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/parsed/filter/userId`;
    return apiClient.post<FilterCandidatesResponse>(url, { userId });
  },

  // POST filter by resumeId
  filterCandidatesByResumeId: async (resumeId: string): Promise<FilterCandidatesResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/parsed/filter/resumeId`;
    return apiClient.post<FilterCandidatesResponse>(url, { resumeId });
  },
};
