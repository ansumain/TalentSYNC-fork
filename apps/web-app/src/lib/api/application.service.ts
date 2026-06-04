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

  getMySkills: async (): Promise<GetAllSkillsResponse> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/skills/me`;
    return apiClient.get<GetAllSkillsResponse>(url);
  },

  addMySkill: async (skillId: string): Promise<{ message: string }> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/skills/me`;
    return apiClient.post<{ message: string }>(url, { skillId });
  },

  removeMySkill: async (skillId: string): Promise<{ message: string }> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/skills/me/${skillId}`;
    return apiClient.delete<{ message: string }>(url);
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

  acceptOrRejectOffer: async (applicationId: string, action: 'accept' | 'reject'): Promise<void> => {
    const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/applications/${applicationId}/offer`;
    return apiClient.patch<void>(url, { action });
  },
};