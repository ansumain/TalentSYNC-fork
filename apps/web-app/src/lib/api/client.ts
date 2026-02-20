import axios, { AxiosError } from 'axios';
import type {AxiosResponse} from 'axios';
import { API_CONFIG } from './config';

export interface ApiError {
  message: string;
  status?: number;
}

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
  (error: AxiosError<{ error?: string }>) => {
    const apiError: ApiError = {
      message: error.response?.data?.error || error.message || 'Network error! Please check your connection!',
      status: error.response?.status || 0,
    };
    return Promise.reject(apiError);
  }
);

// API client
export const apiClient = {
  async get<ResponseType>(endpoint: string): Promise<ResponseType> {
    const response = await axiosInstance.get<ResponseType>(endpoint);
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
};

