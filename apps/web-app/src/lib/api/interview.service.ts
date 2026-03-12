import { apiClient } from './client';
import { API_CONFIG } from './config';

import type { Interview, AvailableInterviewer } from '../types/Interview.type';
export type { Interview, AvailableInterviewer } from '../types/Interview.type';

export const interviewService = {
    getAll: async (): Promise<{ scheduledInterviews: Interview[] }> => {
        const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/interviews`;
        return apiClient.get(url);
    },

    getAssigned: async (): Promise<{ interviews: Interview[] }> => {
        const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/interviews/assigned`;
        return apiClient.get(url);
    },

    getAvailableInterviewers: async (
        date: string,
        applicationId: string
    ): Promise<{ availableInterviewers: AvailableInterviewer[] }> => {
        const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/interviews/interviewers/available`;
        return apiClient.get(url, { date, applicationId });
    },

    schedule: async (data: {
        applicationId: string;
        interviewerId: string;
        managerId: string;
        scheduledAt: string;
    }): Promise<Interview> => {
        const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/interviews`;
        return apiClient.post(url, data);
    },

    update: async (
        interviewId: string,
        data: { interviewerId?: string; managerId?: string; scheduledAt?: string; status?: string }
    ): Promise<{ message: string }> => {
        const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/interviews/${interviewId}`;
        return apiClient.patch(url, data);
    },

    submitResult: async (
        interviewId: string,
        result: 'passed' | 'failed'
    ): Promise<{ message: string }> => {
        const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/interviews/${interviewId}/result`;
        return apiClient.patch(url, { result });
    },

    cancel: async (interviewId: string): Promise<{ message: string }> => {
        const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/interviews/${interviewId}/cancel`;
        return apiClient.patch(url, {});
    },

    getCandidateInterviews: async (): Promise<{ interviews: Interview[] }> => {
        const url = `${API_CONFIG.APPLICATION_SERVICE_URL}/interviews/me`;
        return apiClient.get(url);
    },
};
