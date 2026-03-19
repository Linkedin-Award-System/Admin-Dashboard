import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { z } from 'zod';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipRetry?: boolean;
  validationSchema?: z.ZodSchema;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}

export interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  maxRetries?: number;
  getAuthToken?: () => string | null;
  onAuthError?: () => void;
}

export interface APIClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

// ============================================================================
// Error Messages Mapping
// ============================================================================

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A package with this name already exists. Please use a different name.',
  422: 'Validation failed. Please check your input.',
  500: 'An unexpected server error occurred. Please try again later.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
  504: 'Request timeout. Please try again.',
};

// ============================================================================
// API Client Implementation
// ============================================================================

class APIClientImpl implements APIClient {
  private axiosInstance: AxiosInstance;
  private config: Required<APIClientConfig>;

  constructor(config: APIClientConfig) {
    this.config = {
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000, // 30 seconds default
      maxRetries: config.maxRetries ?? 3,
      getAuthToken: config.getAuthToken ?? (() => null),
      onAuthError: config.onAuthError ?? (() => {}),
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add authentication token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const skipAuth = (config as RequestConfig).skipAuth;
        
        if (!skipAuth) {
          const token = this.config.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors and validation
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Validate response schema if provided
        const validationSchema = (response.config as RequestConfig).validationSchema;
        if (validationSchema) {
          try {
            validationSchema.parse(response.data);
          } catch (error) {
            if (error instanceof z.ZodError) {
              throw new Error('Invalid response data from server');
            }
            throw error;
          }
        }

        return response;
      },
      async (error: AxiosError<APIError>) => {
        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
          this.config.onAuthError();
          throw this.createUserFriendlyError(error);
        }

        // Handle other HTTP errors
        if (error.response) {
          throw this.createUserFriendlyError(error);
        }

        // Handle network errors with retry logic
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
          const skipRetry = (error.config as RequestConfig)?.skipRetry;
          
          if (!skipRetry && error.config) {
            const retryCount = (error.config as RequestConfig & { __retryCount?: number }).__retryCount || 0;
            
            if (retryCount < this.config.maxRetries) {
              (error.config as RequestConfig & { __retryCount?: number }).__retryCount = retryCount + 1;
              
              // Exponential backoff: 100ms, 200ms, 400ms
              const delay = 100 * Math.pow(2, retryCount);
              await this.sleep(delay);
              
              return this.axiosInstance.request(error.config);
            }
          }

          // Max retries exceeded or retry skipped
          if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please check your connection and try again.');
          }
          throw new Error('Network error. Please check your connection and try again.');
        }

        throw error;
      }
    );
  }

  private createUserFriendlyError(error: AxiosError<APIError>): Error {
    const status = error.response?.status;
    const apiError = error.response?.data;

    // Use API error message if available
    if (apiError?.error?.message) {
      return new Error(apiError.error.message);
    }

    // Use predefined error message based on status code
    if (status && ERROR_MESSAGES[status]) {
      return new Error(ERROR_MESSAGES[status]);
    }

    // Fallback error message
    return new Error('An unexpected error occurred. Please try again.');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<APIResponse<T>>(url, config);
    return response.data.data;
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<APIResponse<T>>(url, data, config);
    return response.data.data;
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<APIResponse<T>>(url, data, config);
    return response.data.data;
  }

  async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<APIResponse<T>>(url, data, config);
    return response.data.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<APIResponse<T>>(url, config);
    return response.data.data;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createAPIClient(config: APIClientConfig): APIClient {
  return new APIClientImpl(config);
}

// ============================================================================
// Default Instance (can be configured in app initialization)
// ============================================================================

let defaultClient: APIClient | null = null;

export function initializeAPIClient(config: APIClientConfig): void {
  defaultClient = createAPIClient(config);
}

export function getAPIClient(): APIClient {
  if (!defaultClient) {
    throw new Error('API client not initialized. Call initializeAPIClient first.');
  }
  return defaultClient;
}
