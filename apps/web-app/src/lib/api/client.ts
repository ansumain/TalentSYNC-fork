import axios, { AxiosError, type AxiosProgressEvent, type InternalAxiosRequestConfig } from 'axios';
import type { AxiosResponse } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from './config';
import type { ApiErrorResponse, ApiError } from '../types/Client.type';
import { getErrorPayload } from '../utils/getErrorPayload';

const SKIP_REFRESH_HEADER = 'x-skip-auth-refresh';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function toApiError(error: AxiosError<ApiErrorResponse>): ApiError {

  const payload = getErrorPayload(error);

  return {
    message: payload?.message || error.message || 'Network error! Please check your connection!',
    code: payload?.code || 'NETWORK_ERROR',
    statusCode: payload?.statusCode || error.response?.status || 0,
    status: error.response?.status || 0,
  };
}

function isAuthFailedStatus(status?: number): boolean {
  return status === 401 || status === 403;
}

function canGetRefreshToken(error: AxiosError<ApiErrorResponse>): error is AxiosError<ApiErrorResponse> & { config: RetryableRequestConfig } {
  const request = error.config as RetryableRequestConfig | undefined;
  if (!request) {
    return false;
  }

  const status = error.response?.status;
  if (!isAuthFailedStatus(status)) {
    return false;
  }

  const headers = (request.headers ?? {}) as Record<string, unknown>;
  const skipRefresh = headers[SKIP_REFRESH_HEADER];
  if (skipRefresh) {
    return false;
  }

  const requestUrl = request.url ?? '';
  if (request._retry || requestUrl.includes(API_ENDPOINTS.AUTH.REFRESH)) {
    return false;
  }

  return true;
}

let refreshPromise: Promise<void> | null = null;

export async function renewAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post(API_ENDPOINTS.AUTH.REFRESH, undefined, {
        headers: {
          [SKIP_REFRESH_HEADER]: '1',
        },
      })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise ?? Promise.resolve();
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (canGetRefreshToken(error)) {
      const request = error.config as RetryableRequestConfig;
      request._retry = true;

      try {
        await renewAccessToken();
        return axiosInstance(request);
      } catch (refreshError) {
        return Promise.reject(toApiError(refreshError as AxiosError<ApiErrorResponse>));
      }
    }

    return Promise.reject(toApiError(error));
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

