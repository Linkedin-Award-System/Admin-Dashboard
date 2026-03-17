import { create } from 'zustand';
import type { AuthState, LoginCredentials } from '../types';
import { authService } from '../services/auth-service';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

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
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false, isInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getProfile();
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
    } catch (error) {
      console.error('Session restoration failed:', error);
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  },
}));

// Initialize auth state on app load
useAuthStore.getState().checkAuth();
