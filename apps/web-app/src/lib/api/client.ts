import axios, { AxiosError } from 'axios';
import type {AxiosResponse} from 'axios';
import { API_CONFIG } from './config';

export interface ApiError {
  message: string;
  status?: number;
}

// Create axios instance
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
  (error: AxiosError<{ error?: string }>) => {
    const apiError: ApiError = {
      message: error.response?.data?.error || error.message || 'Network error. Please check your connection.',
      status: error.response?.status || 0,
    };
    return Promise.reject(apiError);
  }
);

// API client wrapper
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await axiosInstance.get<T>(endpoint);
    return response as unknown as T;
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await axiosInstance.post<T>(endpoint, data);
    return response as unknown as T;
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await axiosInstance.put<T>(endpoint, data);
    return response as unknown as T;
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await axiosInstance.patch<T>(endpoint, data);
    return response as unknown as T;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await axiosInstance.delete<T>(endpoint);
    return response as unknown as T;
  },
};

