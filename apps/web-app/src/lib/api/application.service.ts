// import { apiClient } from './client';
// import { API_CONFIG, API_ENDPOINTS } from './config';

// // Shared pagination types

// export interface PaginationParams {
//   page?: number;
//   limit?: number;
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
//   search?: string;
// }

// export interface PaginationMeta {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// // Candidate types

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
//     education: { name: string; batch: string }[];
//     skills: string[];
//     experience: {
//       company: string;
//       designation: string;
//       startDate: string;
//       endDate: string;
//       durationMonths: number;
//     }[];
//     totalExperience: number;
//   };
//   createdAt: string;
// }

// // Response types
// interface GetAllCandidatesResponse extends PaginationMeta {
//   candidateJSONData: Candidate[];
// }
// interface FilterCandidatesResponse extends PaginationMeta {
//   candidateData: Candidate[];
// }

// export const candidateService = {
//   getAllCandidates: async (params?: PaginationParams): Promise<GetAllCandidatesResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/parsed`;
//     return apiClient.get<GetAllCandidatesResponse>(url, params as Record<string, any>);
//   },

//   getMyResumeStatus: async (): Promise<{ hasResume: boolean }> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/resume-status`;
//     return apiClient.get<{ hasResume: boolean }>(url);
//   },

//   filterCandidatesByUserId: async (userId: string): Promise<FilterCandidatesResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/parsed/filter/userId`;
//     return apiClient.post<FilterCandidatesResponse>(url, { userId });
//   },

//   filterCandidatesByResumeId: async (resumeId: string): Promise<FilterCandidatesResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/parsed/filter/resumeId`;
//     return apiClient.post<FilterCandidatesResponse>(url, { resumeId });
//   },

//   getMyResumes: async (): Promise<{ resumes: Candidate[] }> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/candidate/my-resumes`;
//     return apiClient.get<{ resumes: Candidate[] }>(url);
//   },
// };

// // Job Service 

// export interface Job {
//   jobId: string;
//   title: string;
//   description: string;
//   location: string;
//   jobType: string;
//   openings: number;
//   createdBy: string;
//   createdAt: string;
//   updatedAt: string;
//   skills?: Skill[];
// }

// export type ApplicationStatus = 'applied' | 'shortlisted' | 'interviewing' | 'hired' | 'rejected';

// export interface JobApplication {
//   applicationId: string;
//   userId: string;
//   jobId: string;
//   currentStatus: ApplicationStatus;
//   createdAt: string;
//   updatedAt: string;

//   candidateName?: string | null;
//   jobTitle?: string | null;

//   job?: Pick<Job, 'jobId' | 'title' | 'location' | 'jobType'>;
// }

// export interface RankedApplicant {
//   applicationId: string;
//   userId: string;
//   currentStatus: ApplicationStatus;
//   appliedAt: string;
//   candidateName: string | null;
//   candidateSkills: string[];
//   matchedSkills: string[];
//   matchCount: number;
//   rank: number;
// }

// interface GetAllJobsResponse extends PaginationMeta {
//   currentJobs: Job[];
// }

// interface GetJobByIdResponse {
//   job: Job;
// }

// export const jobService = {
//   getAllJobs: async (params?: PaginationParams): Promise<GetAllJobsResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/jobs`;
//     return apiClient.get<GetAllJobsResponse>(url, params as Record<string, any>);
//   },

//   getJobById: async (jobId: string): Promise<GetJobByIdResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/jobs/${jobId}`;
//     return apiClient.get<GetJobByIdResponse>(url);
//   },

//   createJob: async (data: {
//     title: string;
//     description: string;
//     location: string;
//     jobType: string;
//     openings: number;
//     skillIds: string[];
//   }): Promise<Job> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/jobs`;
//     return apiClient.post<Job>(url, data);
//   },

//   deleteJob: async (jobId: string): Promise<void> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/jobs/${jobId}`;
//     return apiClient.delete<void>(url);
//   },
// };

// // Skill Service

// export interface Skill {
//   skillId: string;
//   skillName: string;
// }

// interface GetAllSkillsResponse {
//   skills: Skill[];
// }

// export const skillService = {
//   getAllSkills: async (): Promise<GetAllSkillsResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/skills`;
//     return apiClient.get<GetAllSkillsResponse>(url);
//   },
// };

// // Application Service

// interface GetAllApplicationsResponse extends PaginationMeta {
//   allApplications: JobApplication[];
// }

// interface GetApplicationsByJobIdResponse {
//   applicationsByJobId: JobApplication[];
// }

// interface GetMyApplicationsResponse extends PaginationMeta {
//   applications: JobApplication[];
// }

// export const applicationService = {
//   applyToJob: async (jobId: string): Promise<JobApplication> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/applications/${jobId}`;
//     return apiClient.post<JobApplication>(url, {});
//   },

//   getMyApplications: async (params?: PaginationParams): Promise<GetMyApplicationsResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/applications/user/me`;
//     return apiClient.get<GetMyApplicationsResponse>(url, params as Record<string, any>);
//   },

//   getAllApplications: async (params?: PaginationParams): Promise<GetAllApplicationsResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/applications`;
//     return apiClient.get<GetAllApplicationsResponse>(url, params as Record<string, any>);
//   },

//   getApplicationsByJobId: async (jobId: string): Promise<GetApplicationsByJobIdResponse> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/applications/job/${jobId}`;
//     return apiClient.get<GetApplicationsByJobIdResponse>(url);
//   },

//   updateApplicationStatus: async (applicationId: string, currentStatus: ApplicationStatus): Promise<void> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/applications/${applicationId}`;
//     return apiClient.patch<void>(url, { currentStatus });
//   },

//   deleteApplication: async (applicationId: string): Promise<void> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/applications/${applicationId}`;
//     return apiClient.delete<void>(url);
//   },

//   getRankedApplicants: async (jobId: string): Promise<{ rankedApplicants: RankedApplicant[] }> => {
//     const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/api/applications/job/${jobId}/ranked`;
//     return apiClient.get<{ rankedApplicants: RankedApplicant[] }>(url);
//   },
// };


import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  PaginationParams,
  Candidate,
  GetAllCandidatesResponse,
  FilterCandidatesResponse,
  GetAllSkillsResponse,
  JobApplication,
  GetMyApplicationsResponse,
  GetAllApplicationsResponse,
  GetApplicationsByJobIdResponse,
  Job,
  RankedApplicant,
  ApplicationStatus,
  GetAllJobsResponse,
  GetJobByIdResponse
} from '../types/index';

export type {
  PaginationParams,
  Candidate,
  GetAllCandidatesResponse,
  FilterCandidatesResponse,
  GetAllSkillsResponse,
  Skill,
  JobApplication,
  GetMyApplicationsResponse,
  GetAllApplicationsResponse,
  GetApplicationsByJobIdResponse,
  Job,
  RankedApplicant,
  ApplicationStatus,
  GetAllJobsResponse,
  GetJobByIdResponse
} from '../types/index';

// Candidate Service
export const candidateService = {
  getAllCandidates: async (params?: PaginationParams): Promise<GetAllCandidatesResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/candidate/parsed`;
    return apiClient.get<GetAllCandidatesResponse>(url, params as Record<string, any>);
  },

  getMyResumeStatus: async (): Promise<{ hasResume: boolean }> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/candidate/resume-status`;
    return apiClient.get<{ hasResume: boolean }>(url);
  },

  filterCandidatesByUserId: async (userId: string): Promise<FilterCandidatesResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/candidate/parsed/userId`;
    return apiClient.get<FilterCandidatesResponse>(url, { userId });
  },

  filterCandidatesByResumeId: async (resumeId: string): Promise<FilterCandidatesResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/candidate/parsed/resumeId`;
    return apiClient.get<FilterCandidatesResponse>(url, { resumeId });
  },

  getMyResumes: async (): Promise<{ resumes: Candidate[] }> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/candidate/my-resumes`;
    return apiClient.get<{ resumes: Candidate[] }>(url);
  },
};

// Job Service 
export const jobService = {
  getAllJobs: async (params?: PaginationParams): Promise<GetAllJobsResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/jobs`;
    return apiClient.get<GetAllJobsResponse>(url, params as Record<string, any>);
  },

  getJobById: async (jobId: string): Promise<GetJobByIdResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/jobs/${jobId}`;
    return apiClient.get<GetJobByIdResponse>(url);
  },

  createJob: async (data: {
    title: string;
    description: string;
    location: string;
    jobType: string;
    openings: number;
    skillIds: string[];
  }): Promise<Job> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/jobs`;
    return apiClient.post<Job>(url, data);
  },

  deleteJob: async (jobId: string): Promise<void> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/jobs/${jobId}`;
    return apiClient.delete<void>(url);
  },
};

// Skill Service
export const skillService = {
  getAllSkills: async (): Promise<GetAllSkillsResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/skills`;
    return apiClient.get<GetAllSkillsResponse>(url);
  },
};

// Application Service
export const applicationService = {
  applyToJob: async (jobId: string): Promise<JobApplication> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/applications/${jobId}`;
    return apiClient.post<JobApplication>(url, {});
  },

  getMyApplications: async (params?: PaginationParams): Promise<GetMyApplicationsResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/applications/user/me`;
    return apiClient.get<GetMyApplicationsResponse>(url, params as Record<string, any>);
  },

  getAllApplications: async (params?: PaginationParams): Promise<GetAllApplicationsResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/applications`;
    return apiClient.get<GetAllApplicationsResponse>(url, params as Record<string, any>);
  },

  getApplicationsByJobId: async (jobId: string): Promise<GetApplicationsByJobIdResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/applications/job/${jobId}`;
    return apiClient.get<GetApplicationsByJobIdResponse>(url);
  },

  updateApplicationStatus: async (applicationId: string, currentStatus: ApplicationStatus): Promise<void> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/applications/${applicationId}`;
    return apiClient.patch<void>(url, { currentStatus });
  },

  deleteApplication: async (applicationId: string): Promise<void> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/applications/${applicationId}`;
    return apiClient.delete<void>(url);
  },

  getRankedApplicants: async (jobId: string): Promise<{ rankedApplicants: RankedApplicant[] }> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/applications/job/${jobId}/ranked`;
    return apiClient.get<{ rankedApplicants: RankedApplicant[] }>(url);
  },
};