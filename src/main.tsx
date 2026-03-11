import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeAPIClient } from '@/lib/api-client'
import { config } from '@/lib/config'
import { useAuthStore } from '@/features/auth'

// Initialize API client with configuration
initializeAPIClient({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  maxRetries: config.api.maxRetries,
  getAuthToken: () => localStorage.getItem('auth_token'),
  onAuthError: () => {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
