import type { LucideIcon } from 'lucide-react';

// ============================================================================
// Metric Card Types
// ============================================================================

export interface TrendData {
  value: number;
  isPositive: boolean;
}

export interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: TrendData;
  format?: 'number' | 'currency' | 'percentage';
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

export interface DashboardMetrics {
  totalNominees: number;
  totalCategories: number;
  totalVotes: number;
  totalRevenue: number;
  trends: {
    nominees: TrendData;
    categories: TrendData;
    votes: TrendData;
    revenue: TrendData;
  };
}

// ============================================================================
// Voting Analytics Types
// ============================================================================

export interface VotingTrendData {
  date: string;
  votes: number;
}

export interface VotesByCategoryData {
  category: string;
  votes: number;
}

export interface VotingStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface VotingTrendsChartProps {
  data: VotingTrendData[];
  isLoading?: boolean;
  error?: Error | null;
}

export interface VotesByCategoryChartProps {
  data: VotesByCategoryData[];
  isLoading?: boolean;
  error?: Error | null;
}

export interface VotingStatusChartProps {
  data: VotingStatusData[];
  isLoading?: boolean;
  error?: Error | null;
}

// ============================================================================
// Payment Analytics Types
// ============================================================================

export interface RevenueTrendData {
  date: string;
  revenue: number;
}

export interface PaymentStatusData {
  status: string;
  count: number;
}

export interface RevenueTrendsChartProps {
  data: RevenueTrendData[];
  isLoading?: boolean;
  error?: Error | null;
}

export interface PaymentStatusChartProps {
  data: PaymentStatusData[];
  isLoading?: boolean;
  error?: Error | null;
}

// ============================================================================
// Nominee Analytics Types
// ============================================================================

export interface NomineesByCategoryData {
  category: string;
  count: number;
}

export interface NomineeStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface NomineesByCategoryChartProps {
  data: NomineesByCategoryData[];
  isLoading?: boolean;
  error?: Error | null;
}

export interface NomineeStatusChartProps {
  data: NomineeStatusData[];
  isLoading?: boolean;
  error?: Error | null;
}

// ============================================================================
// Chart Component Props
// ============================================================================

export interface ChartContainerProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export interface ChartSkeletonProps {
  height?: number;
}

export interface ChartErrorProps {
  error: Error;
  onRetry: () => void;
}

export interface ChartEmptyProps {
  message?: string;
  icon?: LucideIcon;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface MetricsApiResponse {
  totalNominees: number;
  totalCategories: number;
  totalVotes: number;
  totalRevenue: number;
  trends: {
    nominees: TrendData;
    categories: TrendData;
    votes: TrendData;
    revenue: TrendData;
  };
}

export interface VotingTrendsApiResponse {
  data: VotingTrendData[];
}

export interface VotesByCategoryApiResponse {
  data: VotesByCategoryData[];
}

export interface VotingStatusApiResponse {
  data: VotingStatusData[];
}

export interface RevenueTrendsApiResponse {
  data: RevenueTrendData[];
}

export interface PaymentStatusApiResponse {
  data: PaymentStatusData[];
}

export interface NomineesByCategoryApiResponse {
  data: NomineesByCategoryData[];
}

export interface NomineeStatusApiResponse {
  data: NomineeStatusData[];
}

// ============================================================================
// Analytics Service Types
// ============================================================================

export interface AnalyticsService {
  getMetrics: () => Promise<DashboardMetrics>;
  getVotingTrends: (days: number) => Promise<VotingTrendData[]>;
  getVotesByCategory: () => Promise<VotesByCategoryData[]>;
  getVotingStatus: () => Promise<VotingStatusData[]>;
  getRevenueTrends: (days: number) => Promise<RevenueTrendData[]>;
  getPaymentStatus: () => Promise<PaymentStatusData[]>;
  getNomineesByCategory: () => Promise<NomineesByCategoryData[]>;
  getNomineeStatus: () => Promise<NomineeStatusData[]>;
}

// ============================================================================
// Time Range Filter Types
// ============================================================================

export type TimeRangePreset = '7days' | '30days' | '90days' | 'custom';

export interface TimeRangeFilter {
  preset: TimeRangePreset;
  startDate?: string;
  endDate?: string;
}

export interface TimeRangeFilterProps {
  value: TimeRangeFilter;
  onChange: (filter: TimeRangeFilter) => void;
}
