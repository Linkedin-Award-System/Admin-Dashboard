import { useEffect, useState, useTransition } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track navigation loading state
 * Shows loading overlay during route transitions
 */
export const useNavigationLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Use startTransition to avoid cascading renders
    startTransition(() => {
      setIsLoading(true);
    });

    // Hide loading overlay after a short delay to allow page to render
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsLoading(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return isLoading;
};
