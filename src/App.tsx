import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/features/auth';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ToastProvider } from '@/shared/hooks/use-toast';
import { ThemeProvider } from '@/shared/hooks/use-theme';
import { LoadingOverlay } from '@/shared/components/ui/loading-overlay';
import { useNavigationLoading } from '@/shared/hooks/use-navigation-loading';
import { config } from '@/lib/config';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const NomineesPage = lazy(() => import('@/pages/NomineesPage'));
const VotingPage = lazy(() => import('@/pages/VotingPage'));
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'));
const ContentPage = lazy(() => import('@/pages/ContentPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.query.staleTime,
      gcTime: config.query.cacheTime,
      refetchOnWindowFocus: true,
      retry: 3,
      // Optimize network requests
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // Optimize mutation retries
      retry: 1,
    },
  },
});

function AppRoutes() {
  const isNavigating = useNavigationLoading();

  return (
    <>
      <LoadingOverlay visible={isNavigating} />
      <Suspense fallback={<LoadingOverlay visible={true} />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/categories"
            element={
              <AuthGuard>
                <CategoriesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/nominees"
            element={
              <AuthGuard>
                <NomineesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/voting"
            element={
              <AuthGuard>
                <VotingPage />
              </AuthGuard>
            }
          />
          <Route
            path="/payments"
            element={
              <AuthGuard>
                <PaymentsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/content"
            element={
              <AuthGuard>
                <ContentPage />
              </AuthGuard>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
