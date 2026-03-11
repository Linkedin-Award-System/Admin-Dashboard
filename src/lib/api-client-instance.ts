import { createAPIClient } from './api-client';
import { authService } from '@/features/auth/services/auth-service';

// Get base URL from environment variable or use default
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create and export the configured API client instance
export const apiClient = createAPIClient({
  baseURL,
  timeout: 30000,
  maxRetries: 3,
  getAuthToken: () => authService.getToken(),
  onAuthError: () => {
    // This will be called when a 401 response is received
    // We'll handle the redirect in the AuthGuard component
    authService.clearToken();
    window.location.href = '/login';
  },
});
