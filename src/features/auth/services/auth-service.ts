import { apiClient } from '@/lib/api-client-instance';
import type { LoginCredentials, AuthUser } from '../types';

const TOKEN_KEY = 'auth_token';

interface LoginResponse {
  user: AuthUser;
  token?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );

    // Store token if provided (fallback for non-httpOnly cookie setup)
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
    }

    return response.user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
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
