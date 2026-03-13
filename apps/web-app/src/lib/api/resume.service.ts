import { apiClient } from "./client";
import { API_ENDPOINTS, API_CONFIG } from "./config";

export interface UploadResume {
    message: string;
}

export const resumeService = {
    uploadResume: async (files: File[], onProgress?: (progress: number) => void): Promise<UploadResume> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('resume', file);
        });

        const uploadUrl = `${API_CONFIG.RESUME_SERVICE_URL}${API_ENDPOINTS.RESUME.UPLOAD}`

        return apiClient.postFormData<UploadResume>(
            uploadUrl,
            formData,
            onProgress
        );
    }
};