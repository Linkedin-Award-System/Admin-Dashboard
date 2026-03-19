import { apiClient } from '@/lib/api-client-instance';
import type { LoginCredentials, AuthUser } from '../types';

const TOKEN_KEY = 'auth_token';

interface LoginResponse {
  user: AuthUser;
  token?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    console.log('Auth service: Calling API with credentials:', { email: credentials.email });
    console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
    
    try {
      const response = await apiClient.post<LoginResponse>(
        '/admin/auth/login',
        credentials
      );

      console.log('Auth service: Received response:', response);

      // Store token (API returns token in response body)
      if (response.token) {
        console.log('Auth service: Storing token');
        localStorage.setItem(TOKEN_KEY, response.token);
      } else {
        console.warn('Auth service: No token in response');
      }

      return response.user;
    } catch (error) {
      console.error('Auth service: Login failed:', error);
      throw error;
    }
  },

  async getProfile(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/admin/auth/me');
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/admin/auth/password-reset/request', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/admin/auth/password-reset/confirm', { token, newPassword });
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/admin/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local token
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
