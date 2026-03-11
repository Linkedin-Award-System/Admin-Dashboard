# Authentication Module

This module provides complete authentication functionality for the LinkedIn Awards Admin Dashboard, including login, logout, session management, and route protection.

## Features

- ✅ Secure login with email and password
- ✅ Form validation using React Hook Form and Zod
- ✅ State management with Zustand
- ✅ Token storage (localStorage + httpOnly cookies support)
- ✅ Protected routes with AuthGuard
- ✅ Automatic session expiration handling (401 responses)
- ✅ Comprehensive unit tests

## Components

### LoginForm

A fully validated login form with email and password fields.

```tsx
import { LoginForm } from '@/features/auth';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

**Features:**
- Email validation (valid email format required)
- Password validation (minimum 8 characters)
- Error display for validation and API errors
- Loading state during submission
- Accessible form with ARIA attributes

### AuthGuard

A Higher-Order Component (HOC) that protects routes from unauthenticated access.

```tsx
import { AuthGuard } from '@/features/auth';
import { DashboardPage } from '@/pages/DashboardPage';

function ProtectedRoute() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
```

**Behavior:**
- Checks authentication status before rendering children
- Redirects to `/login` if user is not authenticated
- Returns `null` while redirecting (no flash of protected content)

## State Management

### useAuthStore

Zustand store for managing authentication state.

```tsx
import { useAuthStore } from '@/features/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({ email: 'admin@example.com', password: 'password123' });
      // User is now authenticated
    } catch (error) {
      // Handle login error
    }
  };

  const handleLogout = async () => {
    await logout();
    // User is now logged out
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

**State:**
- `user: AuthUser | null` - Current authenticated user
- `isAuthenticated: boolean` - Authentication status
- `login: (credentials) => Promise<void>` - Login function
- `logout: () => Promise<void>` - Logout function
- `checkAuth: () => void` - Check for existing token on initialization

## Services

### authService

Service for making authentication API calls.

```tsx
import { authService } from '@/features/auth';

// Login
const user = await authService.login({
  email: 'admin@example.com',
  password: 'password123',
});

// Logout
await authService.logout();

// Token management
const token = authService.getToken();
authService.setToken('new-token');
authService.clearToken();
```

## API Integration

The authentication module integrates with the API client to:

1. **Add authentication tokens to requests**: The API client automatically includes the auth token in the `Authorization` header for all requests (except those marked with `skipAuth: true`).

2. **Handle 401 responses**: When the API returns a 401 (Unauthorized) status, the API client automatically:
   - Clears the stored token
   - Redirects to the login page
   - Prevents further API calls until re-authenticated

3. **Support httpOnly cookies**: The module supports both localStorage tokens and httpOnly cookies. If the backend sets an httpOnly cookie, the token won't be stored in localStorage.

## Validation Schema

### loginSchema

Zod schema for login form validation.

```tsx
import { loginSchema } from '@/features/auth';

// Schema definition
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Type inference
type LoginFormData = z.infer<typeof loginSchema>;
```

## Types

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}
```

## Usage Example

### Complete App Setup

```tsx
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AuthGuard } from '@/features/auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Login Page

```tsx
// pages/LoginPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, useAuthStore } from '@/features/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

### Protected Dashboard

```tsx
// pages/DashboardPage.tsx
import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';

export function DashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard content */}
      </main>
    </div>
  );
}
```

## Environment Variables

Set the API base URL in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## API Endpoints

The authentication module expects the following API endpoints:

### POST /auth/login

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "1",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "jwt-token-here" // Optional if using httpOnly cookies
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /auth/logout

**Request:** Empty body

**Response:**
```json
{
  "data": {},
  "message": "Logged out successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Testing

The module includes comprehensive unit tests for all components and services.

Run tests:
```bash
npm test -- src/features/auth
```

**Test Coverage:**
- ✅ LoginForm component rendering and validation
- ✅ AuthGuard component protection and redirection
- ✅ authService API calls and token management
- ✅ Form validation for email and password
- ✅ Error handling for failed login attempts
- ✅ Loading states during submission

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage by default. For production, consider using httpOnly cookies set by the backend for better security.

2. **HTTPS**: Always use HTTPS in production to prevent token interception.

3. **Token Expiration**: The module handles 401 responses automatically, but consider implementing token refresh for better UX.

4. **Password Requirements**: Current minimum is 8 characters. Consider adding complexity requirements for production.

5. **Rate Limiting**: Implement rate limiting on the backend to prevent brute force attacks.

## Requirements Validation

This module satisfies the following requirements from the spec:

- **Requirement 1.1**: ✅ Admin users can log in with valid credentials
- **Requirement 1.2**: ✅ Invalid credentials display error messages
- **Requirement 1.3**: ✅ AuthGuard restricts access to authenticated users only
- **Requirement 1.4**: ✅ Session expiration redirects to login (401 handling)
- **Requirement 1.5**: ✅ Logout terminates session and clears tokens
- **Requirement 1.6**: ✅ Supports httpOnly cookie-based token storage

## Future Enhancements

- [ ] Token refresh mechanism
- [ ] Remember me functionality
- [ ] Password reset flow
- [ ] Multi-factor authentication
- [ ] Session timeout warning
- [ ] Concurrent session management
