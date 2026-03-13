import { createAPIClient } from './api-client';
import { authService } from '@/features/auth/services/auth-service';
import { config } from './config';

// Create and export the configured API client instance
export const apiClient = createAPIClient({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  maxRetries: config.api.maxRetries,
  getAuthToken: () => authService.getToken(),
  onAuthError: () => {
    // This will be called when a 401 response is received
    authService.clearToken();
    window.location.href = '/login';
  },
});
