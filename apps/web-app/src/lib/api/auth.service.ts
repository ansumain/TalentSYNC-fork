import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type { RegisterData, RegisterResponse, LoginData, LoginResponse, ForgotPasswordData, ForgotPasswordResponse, ResetPasswordData, ResetPasswordResponse } from '../types/AuthService.type';

const authService = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  async login(data: LoginData): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  async logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  async forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    return apiClient.post<ResetPasswordResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  async refreshToken(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.REFRESH);
  },
};

export { authService }