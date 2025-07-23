import { apiClient, handleApiError } from '@/lib/client-api';
import {
  AuthResponse,
  ApiResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        credentials
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/register',
        credentials
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await apiClient.post('/auth/validate');
      return response.data.success;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }
}

export const authService = new AuthService();
