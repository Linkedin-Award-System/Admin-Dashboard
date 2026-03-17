import { create } from 'zustand';
import type { AuthState, LoginCredentials } from '../types';
import { authService } from '../services/auth-service';

const TOKEN_KEY = 'auth_token';
const SESSION_EXPIRY_KEY = 'auth_session_expiry';
// Sessions expire after 8 hours
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function isSessionExpired(): boolean {
  const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!expiry) return true;
  return Date.now() > parseInt(expiry, 10);
}

function setSessionExpiry(): void {
  localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
}

function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  login: async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials);
    setSessionExpiry();
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    clearSession();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    // No token — not authenticated
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false, isInitialized: true });
      return;
    }

    // Token exists but session has expired — clear and redirect to login
    if (isSessionExpired()) {
      clearSession();
      set({ isAuthenticated: false, user: null, isLoading: false, isInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getProfile();
      // Validate that we got a real user object back
      if (!user || !user.id || !user.email) {
        throw new Error('Invalid profile response');
      }
      // Refresh session expiry on successful validation
      setSessionExpiry();
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
    } catch (error) {
      console.error('Session restoration failed:', error);
      clearSession();
      set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  },
}));

// Initialize auth state on app load
useAuthStore.getState().checkAuth();
