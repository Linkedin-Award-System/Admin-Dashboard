import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from './auth-service';
import { apiClient } from '@/lib/api-client-instance';
import type { Mock } from 'vitest';

// Mock the API client
vi.mock('@/lib/api-client-instance', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('should call login API and return user', async () => {
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as const,
      };

      (apiClient.post as Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await authService.login({
        email: 'admin@example.com',
        password: 'password123',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'admin@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockUser);
    });

    it('should store token in localStorage if provided', async () => {
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as const,
      };

      (apiClient.post as Mock).mockResolvedValue({
        user: mockUser,
        token: 'test-token-123',
      });

      await authService.login({
        email: 'admin@example.com',
        password: 'password123',
      });

      expect(localStorage.getItem('auth_token')).toBe('test-token-123');
    });

    it('should not store token if not provided (httpOnly cookie)', async () => {
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as const,
      };

      (apiClient.post as Mock).mockResolvedValue({
        user: mockUser,
      });

      await authService.login({
        email: 'admin@example.com',
        password: 'password123',
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call logout API and clear token', async () => {
      localStorage.setItem('auth_token', 'test-token');
      (apiClient.post as Mock).mockResolvedValue({});

      await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should clear token even if API call fails', async () => {
      localStorage.setItem('auth_token', 'test-token');
      (apiClient.post as Mock).mockRejectedValue(new Error('Network error'));

      await authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('token management', () => {
    it('should get token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(authService.getToken()).toBe('test-token');
    });

    it('should return null if no token exists', () => {
      expect(authService.getToken()).toBeNull();
    });

    it('should set token in localStorage', () => {
      authService.setToken('new-token');
      expect(localStorage.getItem('auth_token')).toBe('new-token');
    });

    it('should clear token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      authService.clearToken();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});
