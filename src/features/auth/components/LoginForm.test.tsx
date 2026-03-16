import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { useAuthStore } from '../store/auth-store';
import type { Mock } from 'vitest';

// Mock the auth store
vi.mock('../store/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as Mock).mockImplementation((selector: (state: { login: typeof mockLogin }) => typeof mockLogin) =>
      selector({ login: mockLogin })
    );
  });

  it('should render login form with email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should display validation error for empty email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('should display validation error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Type invalid email and valid password
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');

    // Manually trigger validation by changing input type to text temporarily
    // This bypasses browser's built-in email validation for testing
    emailInput.type = 'text';
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('should display validation error for password less than 8 characters', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should call login with form data when valid', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'password123',
      });
    });
  });

  it('should display error message when login fails', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'wrongpassword');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button while submitting', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');

    // Grab button reference before clicking (name changes to "Signing in..." during submission)
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Button is disabled and shows "Signing in..." spinner during submission
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
  });
});
