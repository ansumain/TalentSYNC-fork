// import { apiClient } from './client';
// import { API_CONFIG, API_ENDPOINTS } from './config';

// export interface Candidate {
//   userId: string;
//   id: string;
//   parsedJSON: {
//     name: string | null;
//     email: string | null;
//     phone: string | null;
//   };
//   createdAt: string;
// }

// // Response types
// interface GetAllCandidatesResponse {
//   candidateJSONData: Candidate[];
// }
// interface FilterCandidatesResponse {
//   candidateData: Candidate[];
// }

// export const applicationService = {
//   // GET all candidates
//   getAllCandidates: async (): Promise<GetAllCandidatesResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}${API_ENDPOINTS.CANDIDATE.LISTALL}`;
//     return apiClient.get<GetAllCandidatesResponse>(url);
//   },

//   // POST filter by name
//   filterCandidatesByName: async (name: string): Promise<FilterCandidatesResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}${API_ENDPOINTS.CANDIDATE.FILTERBYNAME}`;
//     return apiClient.get<FilterCandidatesResponse>(url, { name });
//   },

//   // POST filter by userId
//   filterCandidatesByUserId: async (userId: string): Promise<FilterCandidatesResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}${API_ENDPOINTS.CANDIDATE.LISTBYUSERID}`;
//     return apiClient.post<FilterCandidatesResponse>(url, { userId });
//   },

//   // POST filter by resumeId
//   filterCandidatesByResumeId: async (resumeId: string): Promise<FilterCandidatesResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}${API_ENDPOINTS.CANDIDATE.LISTBYUSERID}`;
//     return apiClient.post<FilterCandidatesResponse>(url, { resumeId });
//   },
// };


import { apiClient } from './client';
import { API_CONFIG, API_ENDPOINTS } from './config';

export interface Candidate {
  userId: string;
  id: string;
  parsedJSON: {
    name: string | null;
    email: string | null;
    phone: string | null;
    education: { name: string; batch: string }[];
    skills: string[];
    experience: {
      company: string;
      designation: string;
      startDate: string;
      endDate: string;
      durationMonths: number;
    }[];
    totalExperience: number;
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
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}${API_ENDPOINTS.CANDIDATE.FILTERBYNAME}`
    return apiClient.get<FilterCandidatesResponse>(url, { name });
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

interface GetAllJobsResponse {
  currentJobs: Job[];
}

interface GetJobByIdResponse {
  job: Job;
}

export const jobService = {
  getAllJobs: async (): Promise<GetAllJobsResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/jobs`;
    return apiClient.get<GetAllJobsResponse>(url);
  },

  getJobById: async (jobId: string): Promise<GetJobByIdResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/jobs/${jobId}`;
    return apiClient.get<GetJobByIdResponse>(url);
  },
};