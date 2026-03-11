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

  checkAuth: () => {
    // Check if token exists in localStorage on initialization
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Token exists, but we need to validate it with the server
      // For now, we'll just set a flag that token exists
      // The actual validation will happen on the first API call
      set({ isAuthenticated: true });
    }
  },
}));

// Initialize auth state on store creation
useAuthStore.getState().checkAuth();
