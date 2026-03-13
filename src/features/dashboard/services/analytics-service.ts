import { apiClient } from '@/lib/api-client-instance';
import type {
  DashboardMetrics,
  VotingTrendData,
  VotesByCategoryData,
  VotingStatusData,
  RevenueTrendData,
  PaymentStatusData,
  NomineesByCategoryData,
  NomineeStatusData,
} from '../types';

/**
 * Analytics service for fetching dashboard analytics data
 * Uses real API endpoints: /admin/dashboard, /admin/votes, /admin/payments, /admin/categories, /admin/nominees
 */

// Helper types for API responses
interface DashboardApiResponse {
  totalVotes: number;
  uniqueVoters: number;
  totalRevenue: number;
  categoriesCount: number;
  nomineesCount: number;
  topNominees?: Array<{
    id: string;
    fullName: string;
    voteCount: number;
    category: string;
  }>;
}

interface Vote {
  id: string;
  nomineeId: string;
  categoryId: string;
  userId: string;
  quantity: number;
  type: string;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  nomineeCount?: number;
}

interface Nominee {
  id: string;
  fullName: string;
  voteCount: number;
  categories: Array<{ id: string; name: string }>;
}

export const analyticsService = {
  /**
   * Fetch dashboard metrics from /admin/dashboard
   * @returns Promise with dashboard metrics data
   */
  async getMetrics(): Promise<DashboardMetrics> {
    const data = await apiClient.get<DashboardApiResponse>('/admin/dashboard');
    
    // Return metrics with zero trends (we don't have historical data for trends)
    return {
      totalNominees: data.nomineesCount || 0,
      totalCategories: data.categoriesCount || 0,
      totalVotes: data.totalVotes || 0,
      totalRevenue: data.totalRevenue || 0,
      trends: {
        nominees: { value: 0, isPositive: true },
        categories: { value: 0, isPositive: true },
        votes: { value: 0, isPositive: true },
        revenue: { value: 0, isPositive: true },
      },
    };
  },

  /**
   * Fetch voting trends by aggregating votes from /admin/votes
   */
  async getVotingTrends(days: number = 30): Promise<VotingTrendData[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch votes with date range
      const response = await apiClient.get<{ votes: Vote[]; pagination: any }>('/admin/votes', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 1000,
        },
      });

      const votes = response.votes || [];

      // Group votes by date
      const votesByDate = new Map<string, number>();
      
      votes.forEach((vote) => {
        const date = new Date(vote.createdAt).toISOString().split('T')[0];
        votesByDate.set(date, (votesByDate.get(date) || 0) + vote.quantity);
      });

      // Convert to array and sort by date
      const trends: VotingTrendData[] = Array.from(votesByDate.entries())
        .map(([date, votes]) => ({ date, votes }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return trends;
    } catch (error) {
      console.error('Error fetching voting trends:', error);
      return [];
    }
  },

  /**
   * Fetch vote distribution by category from /admin/votes
   */
  async getVotesByCategory(): Promise<VotesByCategoryData[]> {
    try {
      // Fetch all votes
      const response = await apiClient.get<{ votes: Vote[]; pagination: any }>('/admin/votes', {
        params: { limit: 1000 },
      });

      const votes = response.votes || [];

      // Fetch categories to get names
      const categories = await apiClient.get<Category[]>('/admin/categories');
      const categoryMap = new Map(categories.map(c => [c.id, c.name]));

      // Group votes by category
      const votesByCategory = new Map<string, number>();
      
      votes.forEach((vote) => {
        const categoryName = categoryMap.get(vote.categoryId) || 'Unknown';
        votesByCategory.set(categoryName, (votesByCategory.get(categoryName) || 0) + vote.quantity);
      });

      // Convert to array
      return Array.from(votesByCategory.entries())
        .map(([category, votes]) => ({ category, votes }))
        .sort((a, b) => b.votes - a.votes);
    } catch (error) {
      console.error('Error fetching votes by category:', error);
      return [];
    }
  },

  /**
   * Fetch voting status distribution (vote types)
   */
  async getVotingStatus(): Promise<VotingStatusData[]> {
    try {
      const response = await apiClient.get<{ votes: Vote[]; pagination: any }>('/admin/votes', {
        params: { limit: 1000 },
      });

      const votes = response.votes || [];

      // Group by vote type
      const votesByType = new Map<string, number>();
      
      votes.forEach((vote) => {
        const type = vote.type || 'STANDARD';
        votesByType.set(type, (votesByType.get(type) || 0) + 1);
      });

      const total = votes.length;

      // Convert to array with percentages
      return Array.from(votesByType.entries())
        .map(([status, count]) => ({
          status,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }));
    } catch (error) {
      console.error('Error fetching voting status:', error);
      return [];
    }
  },

  /**
   * Fetch revenue trends from /admin/payments
   */
  async getRevenueTrends(days: number = 30): Promise<RevenueTrendData[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const response = await apiClient.get<{ payments: Payment[]; pagination: any }>('/admin/payments', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: 'COMPLETED',
          limit: 1000,
        },
      });

      const payments = response.payments || [];

      // Group payments by date
      const revenueByDate = new Map<string, number>();
      
      payments.forEach((payment) => {
        if (payment.status === 'COMPLETED') {
          const date = new Date(payment.createdAt).toISOString().split('T')[0];
          revenueByDate.set(date, (revenueByDate.get(date) || 0) + payment.amount);
        }
      });

      // Convert to array and sort by date
      return Array.from(revenueByDate.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error fetching revenue trends:', error);
      return [];
    }
  },

  /**
   * Fetch payment status distribution from /admin/payments
   */
  async getPaymentStatus(): Promise<PaymentStatusData[]> {
    try {
      const response = await apiClient.get<{ payments: Payment[]; pagination: any }>('/admin/payments', {
        params: { limit: 1000 },
      });

      const payments = response.payments || [];

      // Group by status
      const paymentsByStatus = new Map<string, number>();
      
      payments.forEach((payment) => {
        const status = payment.status;
        paymentsByStatus.set(status, (paymentsByStatus.get(status) || 0) + 1);
      });

      // Convert to array
      return Array.from(paymentsByStatus.entries())
        .map(([status, count]) => ({ status, count }));
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return [];
    }
  },

  /**
   * Fetch nominee distribution by category from /admin/categories
   */
  async getNomineesByCategory(): Promise<NomineesByCategoryData[]> {
    try {
      const categories = await apiClient.get<Category[]>('/admin/categories');

      return categories
        .map((category) => ({
          category: category.name,
          count: category.nomineeCount || 0,
        }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching nominees by category:', error);
      return [];
    }
  },

  /**
   * Fetch nominee status distribution (active vs inactive based on votes)
   */
  async getNomineeStatus(): Promise<NomineeStatusData[]> {
    try {
      const nominees = await apiClient.get<Nominee[]>('/admin/nominees');

      // Categorize nominees by vote count
      const withVotes = nominees.filter(n => n.voteCount > 0).length;
      const withoutVotes = nominees.filter(n => n.voteCount === 0).length;
      const total = nominees.length;

      return [
        {
          status: 'Active (with votes)',
          count: withVotes,
          percentage: total > 0 ? (withVotes / total) * 100 : 0,
        },
        {
          status: 'Inactive (no votes)',
          count: withoutVotes,
          percentage: total > 0 ? (withoutVotes / total) * 100 : 0,
        },
      ];
    } catch (error) {
      console.error('Error fetching nominee status:', error);
      return [];
    }
  },
};
