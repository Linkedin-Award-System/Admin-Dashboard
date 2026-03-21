export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  avatarUrl?: string;
  jobTitle?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setAvatarUrl: (url: string) => void;
  updateProfile: (data: { firstName: string; lastName: string; email: string; jobTitle: string }) => void;
}
