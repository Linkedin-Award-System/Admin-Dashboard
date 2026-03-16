import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics-service';

/**
 * Query key constants for dashboard analytics
 */
const DASHBOARD_QUERY_KEY = ['dashboard'];

/**
 * Hook to fetch dashboard metrics including totals and trends
 * @returns React Query result with dashboard metrics data
 */
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'metrics'],
    queryFn: () => analyticsService.getMetrics(),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch voting trends over time
 * @param days - Number of days to fetch trends for (default: 30)
 * @returns React Query result with voting trend data
 */
export const useVotingTrends = (days: number = 30) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'voting-trends', days],
    queryFn: () => analyticsService.getVotingTrends(days),
    refetchInterval: 30000,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch vote distribution by category
 * @returns React Query result with votes by category data
 */
export const useVotesByCategory = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'votes-by-category'],
    queryFn: () => analyticsService.getVotesByCategory(),
    refetchInterval: 30000,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch voting status distribution (active vs completed)
 * @returns React Query result with voting status data
 */
export const useVotingStatus = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'voting-status'],
    queryFn: () => analyticsService.getVotingStatus(),
    refetchInterval: 30000,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch revenue trends over time
 * @param days - Number of days to fetch trends for (default: 30)
 * @returns React Query result with revenue trend data
 */
export const useRevenueTrends = (days: number = 30) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'revenue-trends', days],
    queryFn: () => analyticsService.getRevenueTrends(days),
    refetchInterval: 30000,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch payment status distribution (completed, pending, failed)
 * @returns React Query result with payment status data
 */
export const usePaymentStatus = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'payment-status'],
    queryFn: () => analyticsService.getPaymentStatus(),
    refetchInterval: 30000,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch nominee distribution by category
 * @returns React Query result with nominees by category data
 */
export const useNomineesByCategory = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'nominees-by-category'],
    queryFn: () => analyticsService.getNomineesByCategory(),
    refetchInterval: 30000,
    staleTime: 30000,
  });
};

/**
 * Hook to fetch nominee status distribution (approved, pending, rejected)
 * @returns React Query result with nominee status data
 */
export const useNomineeStatus = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'nominee-status'],
    queryFn: () => analyticsService.getNomineeStatus(),
    refetchInterval: 30000,
    staleTime: 30000,
  });
};
