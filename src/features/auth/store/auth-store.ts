import { create } from 'zustand';
import type { AuthState, LoginCredentials } from '../types';
import { authService } from '../services/auth-service';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        // Optimistically set authenticated while fetching profile
        set({ isAuthenticated: true });
        const user = await authService.getProfile();
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Session restoration failed:', error);
        localStorage.removeItem(TOKEN_KEY);
        set({ user: null, isAuthenticated: false });
      }
    }
  },
}));

// Initialize auth state
useAuthStore.getState().checkAuth();
