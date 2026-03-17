import axios, { AxiosError, type AxiosProgressEvent } from 'axios';
import type { AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import type { ApiErrorResponse, ApiError } from '../types/Client.type';
import { getErrorPayload } from '../utils/getErrorPayload';

// create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<ApiErrorResponse>) => {
    const payload = getErrorPayload(error);

    const apiError: ApiError = {
      message: payload?.message || error.message || 'Network error! Please check your connection!',
      code: payload?.code || 'NETWORK_ERROR',
      statusCode: payload?.statusCode || error.response?.status || 0,
      status: error.response?.status || 0,
    };

    return Promise.reject(apiError);
  }
);

// API client
export const apiClient = {
  async get<ResponseType>(endpoint: string, params?: Record<string, any>): Promise<ResponseType> {
    const response = await axiosInstance.get<ResponseType>(endpoint, { params });
    return response as unknown as ResponseType;
  },

  async post<ResponseType>(endpoint: string, data?: unknown): Promise<ResponseType> {
    const response = await axiosInstance.post<ResponseType>(endpoint, data);
    return response as unknown as ResponseType;
  },

  async put<ResponseType>(endpoint: string, data?: unknown): Promise<ResponseType> {
    const response = await axiosInstance.put<ResponseType>(endpoint, data);
    return response as unknown as ResponseType;
  },

  async patch<ResponseType>(endpoint: string, data?: unknown): Promise<ResponseType> {
    const response = await axiosInstance.patch<ResponseType>(endpoint, data);
    return response as unknown as ResponseType;
  },

  async delete<ResponseType>(endpoint: string): Promise<ResponseType> {
    const response = await axiosInstance.delete<ResponseType>(endpoint);
    return response as unknown as ResponseType;
  },

  async postFormData<ResponseType>(endpoint: string, formData: FormData, onProgress?: (progress: number) => void): Promise<ResponseType> {
    const response = await axiosInstance.post<ResponseType>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(percentCompleted);
        }
      }
    });
    return response as unknown as ResponseType;
  }
};

