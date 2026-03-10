import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import fc from 'fast-check';
import { createAPIClient, type APIClientConfig, type APIError } from './api-client';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('API Client', () => {
  let mockAxiosInstance: any;
  let getAuthToken: () => string | null;
  let onAuthError: () => void;
  let config: APIClientConfig;

  beforeEach(() => {
    vi.clearAllMocks();
    
    getAuthToken = vi.fn<() => string | null>(() => 'test-token') as () => string | null;
    onAuthError = vi.fn<() => void>() as () => void;

    config = {
      baseURL: 'https://api.example.com',
      timeout: 30000,
      maxRetries: 3,
      getAuthToken,
      onAuthError,
    };

    // Create mock axios instance
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn((onFulfilled, onRejected) => {
            mockAxiosInstance._requestInterceptor = { onFulfilled, onRejected };
          }),
        },
        response: {
          use: vi.fn((onFulfilled, onRejected) => {
            mockAxiosInstance._responseInterceptor = { onFulfilled, onRejected };
          }),
        },
      },
      request: vi.fn(),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================================
  // Unit Tests - Configuration and Initialization
  // ============================================================================

  describe('Configuration', () => {
    it('should create axios instance with correct base URL and timeout', () => {
      createAPIClient(config);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should use default timeout of 30 seconds when not provided', () => {
      const configWithoutTimeout = { ...config };
      delete configWithoutTimeout.timeout;
      
      createAPIClient(configWithoutTimeout);

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000,
        })
      );
    });

    it('should use default maxRetries of 3 when not provided', () => {
      const configWithoutRetries = { ...config };
      delete configWithoutRetries.maxRetries;
      
      const client = createAPIClient(configWithoutRetries);
      
      // The client should be created successfully
      expect(client).toBeDefined();
    });
  });

  // ============================================================================
  // Unit Tests - Request Interceptor
  // ============================================================================

  describe('Request Interceptor', () => {
    it('should add authorization header with token', () => {
      createAPIClient(config);

      const requestConfig = { headers: {} };
      const result = mockAxiosInstance._requestInterceptor.onFulfilled(requestConfig);

      expect(result.headers.Authorization).toBe('Bearer test-token');
      expect(getAuthToken).toHaveBeenCalled();
    });

    it('should not add authorization header when skipAuth is true', () => {
      createAPIClient(config);

      const requestConfig = { headers: {}, skipAuth: true };
      const result = mockAxiosInstance._requestInterceptor.onFulfilled(requestConfig);

      expect(result.headers.Authorization).toBeUndefined();
      expect(getAuthToken).not.toHaveBeenCalled();
    });

    it('should not add authorization header when token is null', () => {
      const mockGetAuthToken = vi.fn<() => string | null>(() => null);
      const configWithNullToken = { ...config, getAuthToken: mockGetAuthToken };
      createAPIClient(configWithNullToken);

      const requestConfig = { headers: {} };
      const result = mockAxiosInstance._requestInterceptor.onFulfilled(requestConfig);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  // ============================================================================
  // Unit Tests - Response Interceptor - Error Handling
  // ============================================================================

  describe('Response Interceptor - Error Handling', () => {
    it('should call onAuthError and throw error on 401 response', async () => {
      createAPIClient(config);

      const error: Partial<AxiosError<APIError>> = {
        response: {
          status: 401,
          data: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Unauthorized access',
            },
            timestamp: new Date().toISOString(),
          },
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message: 'Request failed with status code 401',
      };

      await expect(
        mockAxiosInstance._responseInterceptor.onRejected(error)
      ).rejects.toThrow();

      expect(onAuthError).toHaveBeenCalled();
    });

    it('should throw user-friendly error for 403 response', async () => {
      createAPIClient(config);

      const error: Partial<AxiosError<APIError>> = {
        response: {
          status: 403,
          data: {
            error: {
              code: 'FORBIDDEN',
              message: 'Access denied',
            },
            timestamp: new Date().toISOString(),
          },
          statusText: 'Forbidden',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message: 'Request failed with status code 403',
      };

      await expect(
        mockAxiosInstance._responseInterceptor.onRejected(error)
      ).rejects.toThrow('Access denied');
    });

    it('should throw user-friendly error for 404 response', async () => {
      createAPIClient(config);

      const error: Partial<AxiosError<APIError>> = {
        response: {
          status: 404,
          data: {
            error: {
              code: 'NOT_FOUND',
              message: 'Resource not found',
            },
            timestamp: new Date().toISOString(),
          },
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message: 'Request failed with status code 404',
      };

      await expect(
        mockAxiosInstance._responseInterceptor.onRejected(error)
      ).rejects.toThrow('Resource not found');
    });

    it('should throw user-friendly error for 422 response', async () => {
      createAPIClient(config);

      const error: Partial<AxiosError<APIError>> = {
        response: {
          status: 422,
          data: {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Validation failed',
              details: {
                name: ['Name is required'],
              },
            },
            timestamp: new Date().toISOString(),
          },
          statusText: 'Unprocessable Entity',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message: 'Request failed with status code 422',
      };

      await expect(
        mockAxiosInstance._responseInterceptor.onRejected(error)
      ).rejects.toThrow('Validation failed');
    });

    it('should throw user-friendly error for 500 response', async () => {
      createAPIClient(config);

      const error: Partial<AxiosError<APIError>> = {
        response: {
          status: 500,
          data: {
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
            },
            timestamp: new Date().toISOString(),
          },
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message: 'Request failed with status code 500',
      };

      await expect(
        mockAxiosInstance._responseInterceptor.onRejected(error)
      ).rejects.toThrow('Internal server error');
    });
  });

  // ============================================================================
  // Unit Tests - Response Schema Validation
  // ============================================================================

  describe('Response Schema Validation', () => {
    it('should validate response data against provided schema', () => {
      createAPIClient(config);

      const schema = z.object({
        data: z.object({
          id: z.string(),
          name: z.string(),
        }),
      });

      const response = {
        data: {
          data: {
            id: '123',
            name: 'Test',
          },
        },
        config: { validationSchema: schema },
      };

      const result = mockAxiosInstance._responseInterceptor.onFulfilled(response);
      expect(result).toEqual(response);
    });

    it('should throw error when response data does not match schema', () => {
      createAPIClient(config);

      const schema = z.object({
        data: z.object({
          id: z.string(),
          name: z.string(),
        }),
      });

      const response = {
        data: {
          data: {
            id: 123, // Should be string
            name: 'Test',
          },
        },
        config: { validationSchema: schema },
      };

      expect(() =>
        mockAxiosInstance._responseInterceptor.onFulfilled(response)
      ).toThrow('Invalid response data from server');
    });
  });

  // ============================================================================
  // Unit Tests - HTTP Methods
  // ============================================================================

  describe('HTTP Methods', () => {
    it('should make GET request and return data', async () => {
      const client = createAPIClient(config);
      const responseData = { id: '1', name: 'Test' };
      
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          data: responseData,
          timestamp: new Date().toISOString(),
        },
      });

      const result = await client.get('/test');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(responseData);
    });

    it('should make POST request with data and return response', async () => {
      const client = createAPIClient(config);
      const requestData = { name: 'New Item' };
      const responseData = { id: '1', name: 'New Item' };
      
      mockAxiosInstance.post.mockResolvedValue({
        data: {
          data: responseData,
          timestamp: new Date().toISOString(),
        },
      });

      const result = await client.post('/test', requestData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', requestData, undefined);
      expect(result).toEqual(responseData);
    });

    it('should make PUT request with data and return response', async () => {
      const client = createAPIClient(config);
      const requestData = { name: 'Updated Item' };
      const responseData = { id: '1', name: 'Updated Item' };
      
      mockAxiosInstance.put.mockResolvedValue({
        data: {
          data: responseData,
          timestamp: new Date().toISOString(),
        },
      });

      const result = await client.put('/test/1', requestData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', requestData, undefined);
      expect(result).toEqual(responseData);
    });

    it('should make DELETE request and return response', async () => {
      const client = createAPIClient(config);
      const responseData = { success: true };
      
      mockAxiosInstance.delete.mockResolvedValue({
        data: {
          data: responseData,
          timestamp: new Date().toISOString(),
        },
      });

      const result = await client.delete('/test/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
      expect(result).toEqual(responseData);
    });
  });

  // ============================================================================
  // Unit Tests - Retry Logic
  // ============================================================================

  describe('Retry Logic', () => {
    it('should implement exponential backoff delays', async () => {
      createAPIClient(config);

      const error: Partial<AxiosError> = {
        code: 'ERR_NETWORK',
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message: 'Network Error',
      };

      // Mock request to eventually succeed
      mockAxiosInstance.request.mockResolvedValueOnce({ data: { data: 'success' } });

      const startTime = Date.now();
      const result = await mockAxiosInstance._responseInterceptor.onRejected(error);
      const endTime = Date.now();

      // Should have some delay due to exponential backoff (at least 100ms for first retry)
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
      expect(result.data.data).toBe('success');
    });

    it('should not retry when skipRetry is true', async () => {
      createAPIClient(config);

      const error: Partial<AxiosError> = {
        code: 'ERR_NETWORK',
        config: { skipRetry: true } as any,
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message: 'Network Error',
      };

      await expect(
        mockAxiosInstance._responseInterceptor.onRejected(error)
      ).rejects.toThrow('Network error');

      expect(mockAxiosInstance.request).not.toHaveBeenCalled();
    });

    it('should throw timeout error after max retries for ECONNABORTED', async () => {
      createAPIClient(config);

      const error: Partial<AxiosError> = {
        code: 'ECONNABORTED',
        config: { __retryCount: 3 } as any,
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message: 'timeout of 30000ms exceeded',
      };

      // First call triggers retries
      const promise = mockAxiosInstance._responseInterceptor.onRejected(error);

      // Wait for retries to complete
      await expect(promise).rejects.toThrow('Request timeout');
    });
  });

  // ============================================================================
  // Property-Based Tests
  // ============================================================================

  describe('Property-Based Tests', () => {
    // Feature: linkedin-awards-admin-dashboard, Property 32: API Request Authentication Invariant
    it('Property 32: should always include auth token in requests when not skipped', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (token, endpoint) => {
            const mockGetAuthToken = vi.fn<() => string | null>(() => token);
            const configWithToken = { ...config, getAuthToken: mockGetAuthToken };
            createAPIClient(configWithToken);

            const requestConfig = { headers: {}, url: endpoint };
            const result = mockAxiosInstance._requestInterceptor.onFulfilled(requestConfig);

            expect(result.headers.Authorization).toBe(`Bearer ${token}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: linkedin-awards-admin-dashboard, Property 34: API Error Status Handling
    it('Property 34: should handle all 4xx and 5xx errors without crashing', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 400, max: 599 }),
          fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
          async (statusCode, errorMessage) => {
            createAPIClient(config);

            const error: Partial<AxiosError<APIError>> = {
              response: {
                status: statusCode,
                data: {
                  error: {
                    code: 'ERROR',
                    message: errorMessage,
                  },
                  timestamp: new Date().toISOString(),
                },
                statusText: 'Error',
                headers: {},
                config: {} as any,
              },
              config: {} as any,
              isAxiosError: true,
              toJSON: () => ({}),
              name: 'AxiosError',
              message: `Request failed with status code ${statusCode}`,
            };

            try {
              await mockAxiosInstance._responseInterceptor.onRejected(error);
              // Should not reach here
              return false;
            } catch (e) {
              // Should throw an error, not crash
              return e instanceof Error;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: linkedin-awards-admin-dashboard, Property 35: API Response Schema Validation
    it('Property 35: should validate all responses against schema when provided', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            value: fc.integer({ min: 0, max: 1000 }),
          }),
          (data) => {
            createAPIClient(config);

            const schema = z.object({
              data: z.object({
                id: z.string(),
                name: z.string(),
                value: z.number(),
              }),
            });

            const response = {
              data: { data },
              config: { validationSchema: schema },
            };

            const result = mockAxiosInstance._responseInterceptor.onFulfilled(response);
            expect(result).toEqual(response);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
