# API Client Documentation

## Overview

The API client is a centralized HTTP client built on Axios that handles all communication with the backend API. It provides automatic authentication, error handling, retry logic, and response validation.

## Configuration

The API client is configured in `src/lib/api-client.ts` and initialized in `src/main.tsx`.

### Initialization

```typescript
import { initializeAPIClient } from '@/lib/api-client';
import { config } from '@/lib/config';

initializeAPIClient({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  maxRetries: config.api.maxRetries,
  getAuthToken: () => localStorage.getItem('auth_token'),
  onAuthError: () => {
    // Handle authentication errors
    useAuthStore.getState().logout();
    window.location.href = '/login';
  },
});
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | string | Base URL for all API requests |
| `timeout` | number | Request timeout in milliseconds (default: 30000) |
| `maxRetries` | number | Maximum retry attempts for failed requests (default: 3) |
| `getAuthToken` | function | Function to retrieve authentication token |
| `onAuthError` | function | Callback when authentication fails (401 response) |

## Usage

### Getting the Client Instance

```typescript
import { getAPIClient } from '@/lib/api-client';

const client = getAPIClient();
```

### Making Requests

#### GET Request

```typescript
// Simple GET
const categories = await client.get('/categories');

// GET with query parameters
const filteredCategories = await client.get('/categories', {
  params: { status: 'active' }
});
```

#### POST Request

```typescript
const newCategory = await client.post('/categories', {
  name: 'Best Innovator',
  description: 'Award for innovation'
});
```

#### PUT Request

```typescript
const updatedCategory = await client.put('/categories/123', {
  name: 'Updated Name',
  description: 'Updated description'
});
```

#### DELETE Request

```typescript
await client.delete('/categories/123');
```

## Features

### Automatic Authentication

The client automatically includes the JWT token in the `Authorization` header for all requests (unless `skipAuth: true` is specified).

```typescript
// Skip authentication for a specific request
const publicData = await client.get('/public/data', {
  skipAuth: true
});
```

### Retry Logic with Exponential Backoff

Failed requests are automatically retried up to 3 times (configurable) with exponential backoff:
- 1st retry: 100ms delay
- 2nd retry: 200ms delay
- 3rd retry: 400ms delay

```typescript
// Skip retry for a specific request
const data = await client.get('/data', {
  skipRetry: true
});
```

### Error Handling

The client provides user-friendly error messages based on HTTP status codes:

| Status Code | Error Message |
|-------------|---------------|
| 400 | Invalid request. Please check your input and try again. |
| 401 | Your session has expired. Please log in again. |
| 403 | You do not have permission to perform this action. |
| 404 | The requested resource was not found. |
| 422 | Validation failed. Please check your input. |
| 500 | An unexpected server error occurred. Please try again later. |
| 502/503 | Service temporarily unavailable. Please try again later. |
| 504 | Request timeout. Please try again. |

### Response Validation

You can optionally validate API responses using Zod schemas:

```typescript
import { z } from 'zod';

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

const category = await client.get('/categories/123', {
  validationSchema: categorySchema
});
```

If the response doesn't match the schema, an error is thrown before the data is returned.

### Request/Response Interceptors

The client uses Axios interceptors to:

1. **Request Interceptor**:
   - Add authentication token to headers
   - Log requests in debug mode

2. **Response Interceptor**:
   - Validate response schemas
   - Handle authentication errors (401)
   - Transform error messages
   - Implement retry logic

## API Response Format

All API responses follow a consistent structure:

```typescript
interface APIResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}
```

The client automatically extracts the `data` field, so you receive the actual data directly:

```typescript
// API returns: { data: [...], message: "Success", timestamp: "..." }
// You receive: [...]
const categories = await client.get('/categories');
```

## Error Response Format

Error responses follow this structure:

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}
```

## Best Practices

### 1. Use Service Layers

Create service modules for each feature that encapsulate API calls:

```typescript
// src/features/categories/services/category-service.ts
import { getAPIClient } from '@/lib/api-client';
import type { Category, CategoryFormData } from '../types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    return getAPIClient().get('/categories');
  },

  getById: async (id: string): Promise<Category> => {
    return getAPIClient().get(`/categories/${id}`);
  },

  create: async (data: CategoryFormData): Promise<Category> => {
    return getAPIClient().post('/categories', data);
  },

  update: async (id: string, data: CategoryFormData): Promise<Category> => {
    return getAPIClient().put(`/categories/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return getAPIClient().delete(`/categories/${id}`);
  },
};
```

### 2. Use React Query for Data Fetching

Combine the API client with React Query for optimal data management:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category-service';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
```

### 3. Handle Errors Gracefully

Always handle errors in your components:

```typescript
const { data, error, isError } = useCategories();

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

### 4. Use TypeScript Types

Define types for all API requests and responses:

```typescript
interface CreateCategoryRequest {
  name: string;
  description: string;
}

interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
```

## Troubleshooting

### CORS Errors

If you encounter CORS errors:
1. Ensure the backend API has CORS configured for your frontend URL
2. Check that `VITE_API_BASE_URL` is correctly set in your `.env` file
3. Verify the backend is running and accessible

### Authentication Errors

If authentication isn't working:
1. Check that the token is being stored in localStorage
2. Verify the `getAuthToken` function is correctly configured
3. Check browser console for error messages
4. Ensure the backend is returning valid JWT tokens

### Timeout Errors

If requests are timing out:
1. Increase `VITE_API_TIMEOUT` in your `.env` file
2. Check network connectivity
3. Verify the backend is responding within the timeout period

### Retry Logic Not Working

If retries aren't happening:
1. Check that `skipRetry` is not set to `true`
2. Verify `maxRetries` is configured correctly
3. Check browser console for retry attempts

## Advanced Usage

### Custom Request Configuration

You can pass custom Axios configuration options:

```typescript
const data = await client.get('/data', {
  headers: {
    'Custom-Header': 'value'
  },
  params: {
    page: 1,
    limit: 10
  },
  timeout: 5000, // Override default timeout
});
```

### Canceling Requests

Use Axios cancel tokens to cancel requests:

```typescript
import axios from 'axios';

const source = axios.CancelToken.source();

try {
  const data = await client.get('/data', {
    cancelToken: source.token
  });
} catch (error) {
  if (axios.isCancel(error)) {
    console.log('Request canceled');
  }
}

// Cancel the request
source.cancel('Operation canceled by user');
```

## Testing

### Mocking the API Client

For testing, you can mock the API client:

```typescript
import { vi } from 'vitest';
import * as apiClient from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({
  getAPIClient: () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
}));

// In your test
const mockGet = vi.mocked(apiClient.getAPIClient().get);
mockGet.mockResolvedValue([{ id: '1', name: 'Test' }]);
```

## Related Documentation

- [Environment Configuration](../README.md#environment-variables)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
