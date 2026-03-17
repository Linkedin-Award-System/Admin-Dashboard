import { apiClient } from '@/lib/api-client-instance';
import type { VoteStats, VoteTimelineData, DateRange } from '../types';

interface Vote {
  id: string;
  nomineeId: string;
  categoryId: string;
  userId: string;
  quantity: number;
  type: 'FREE' | 'PREMIUM';
  createdAt: string;
}

interface VotesResponse {
  votes: Vote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  nomineeCount: number;
}

interface Nominee {
  id: string;
  fullName: string;
  name?: string;
  voteCount: number;
  categories?: Array<{ id: string; name: string } | string>;
}

export const votingService = {
  async getStats(dateRange?: DateRange): Promise<VoteStats[]> {
    // Fetch votes, categories, and nominees in parallel
    const params: any = { limit: 1000 };
    if (dateRange) {
      params.startDate = dateRange.startDate;
      params.endDate = dateRange.endDate;
    }
    
    const [votesResponse, categoriesResponse, nomineesResponse] = await Promise.all([
      apiClient.get<VotesResponse>('/admin/votes', { params }),
      apiClient.get<Category[]>('/admin/categories'),
      apiClient.get<Nominee[]>('/admin/nominees'),
    ]);
    
    const votes = votesResponse.votes || [];
    const categories = categoriesResponse || [];
    const nominees = nomineesResponse || [];
    
    // Create category map
    const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
    
    // Aggregate votes by category and nominee
    const categoryStats = new Map<string, {
      categoryId: string;
      totalVotes: number;
      nomineeVotes: Map<string, number>;
    }>();
    
    votes.forEach(vote => {
      const existing = categoryStats.get(vote.categoryId) || {
        categoryId: vote.categoryId,
        totalVotes: 0,
        nomineeVotes: new Map(),
      };
      
      existing.totalVotes += vote.quantity;
      existing.nomineeVotes.set(
        vote.nomineeId,
        (existing.nomineeVotes.get(vote.nomineeId) || 0) + vote.quantity
      );
      
      categoryStats.set(vote.categoryId, existing);
    });
    
    // Build VoteStats array
    return Array.from(categoryStats.entries()).map(([categoryId, stats]) => {
      const categoryName = categoryMap.get(categoryId) || 'Unknown Category';
      
      // Get nominees for this category (defensive: handle flat string IDs and object shapes)
      const categoryNominees = nominees.filter(n => {
        if (!n.categories || n.categories.length === 0) return false;
        return n.categories.some(c =>
          typeof c === 'string' ? c === categoryId : c.id === categoryId
        );
      });
      
      // Build nominee vote data
      const nomineeVoteData = categoryNominees.map(nominee => {
        const voteCount = stats.nomineeVotes.get(nominee.id) || 0;
        const nomineeName = nominee.fullName ?? (nominee as any).name ?? 'Unknown';
        return {
          nomineeId: nominee.id,
          nomineeName,
          voteCount,
          percentage: stats.totalVotes > 0 ? (voteCount / stats.totalVotes) * 100 : 0,
        };
      }).sort((a, b) => b.voteCount - a.voteCount);
      
      // Find leading nominee
      const leading = nomineeVoteData[0] || {
        nomineeId: '',
        nomineeName: 'No nominees',
        voteCount: 0,
        percentage: 0,
      };
      
      return {
        categoryId,
        categoryName,
        totalVotes: stats.totalVotes,
        nominees: nomineeVoteData,
        leadingNominee: {
          id: leading.nomineeId,
          name: leading.nomineeName,
          voteCount: leading.voteCount,
        },
      };
    });
  },

  async getTimeline(dateRange?: DateRange): Promise<VoteTimelineData[]> {
    // Use /admin/votes and aggregate by date client-side
    const params: any = { limit: 1000 };
    if (dateRange) {
      params.startDate = dateRange.startDate;
      params.endDate = dateRange.endDate;
    }
    
    const response = await apiClient.get<VotesResponse>('/admin/votes', { params });
    const votes = response.votes || [];
    
    // Aggregate votes by date
    const dateMap = new Map<string, number>();
    
    votes.forEach(vote => {
      const date = new Date(vote.createdAt).toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + vote.quantity);
    });
    
    return Array.from(dateMap.entries())
      .map(([date, count]) => ({
        timestamp: date,
        voteCount: count,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },

  async getUniqueVoterCount(): Promise<number> {
    // Use /admin/votes and count unique userIds client-side
    const response = await apiClient.get<VotesResponse>('/admin/votes', { params: { limit: 1000 } });
    const votes = response.votes || [];
    
    const uniqueUserIds = new Set(votes.map(vote => vote.userId));
    return uniqueUserIds.size;
  },

  async getDashboard(): Promise<any> {
    const response = await apiClient.get('/admin/dashboard');
    return response;
  },
};
