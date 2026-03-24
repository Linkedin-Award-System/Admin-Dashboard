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
  profileImageUrl?: string;
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
      apiClient.get<VotesResponse | Vote[]>('/admin/votes', { params }),
      apiClient.get<{ categories?: Category[] } | Category[]>('/admin/categories'),
      apiClient.get<{ nominees?: Nominee[] } | Nominee[]>('/admin/nominees'),
    ]);
    
    // Defensive unwrap — API client strips the outer `data` wrapper, but the
    // inner shape may vary (array directly, or { votes: [...] }, etc.)
    const votes: Vote[] = Array.isArray(votesResponse)
      ? votesResponse
      : (votesResponse as VotesResponse).votes || [];
    const categories: Category[] = Array.isArray(categoriesResponse)
      ? categoriesResponse
      : (categoriesResponse as { categories?: Category[] }).categories || [];
    const nominees: Nominee[] = Array.isArray(nomineesResponse)
      ? nomineesResponse
      : (nomineesResponse as { nominees?: Nominee[] }).nominees || [];
    
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
          profileImageUrl: nominee.profileImageUrl,
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
    const params: any = { limit: 1000 };
    if (dateRange) {
      params.startDate = dateRange.startDate;
      params.endDate = dateRange.endDate;
    }

    const response = await apiClient.get<VotesResponse | Vote[]>('/admin/votes', { params });
    const votes: Vote[] = Array.isArray(response)
      ? response
      : (response as VotesResponse).votes || [];

    // Aggregate by date+category so per-category filtering works in the chart
    // Key: "date|categoryId"
    const map = new Map<string, { date: string; categoryId: string; count: number }>();

    votes.forEach(vote => {
      const date = new Date(vote.createdAt).toISOString().split('T')[0];
      const key = `${date}|${vote.categoryId}`;
      const existing = map.get(key);
      if (existing) {
        existing.count += vote.quantity;
      } else {
        map.set(key, { date, categoryId: vote.categoryId, count: vote.quantity });
      }
    });

    return Array.from(map.values())
      .map(({ date, categoryId, count }) => ({
        timestamp: date,
        voteCount: count,
        categoryId,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },

  async getUniqueVoterCount(): Promise<number> {
    // Use /admin/votes and count unique userIds client-side
    const response = await apiClient.get<VotesResponse | Vote[]>('/admin/votes', { params: { limit: 1000 } });
    const votes: Vote[] = Array.isArray(response)
      ? response
      : (response as VotesResponse).votes || [];
    
    const uniqueUserIds = new Set(votes.map(vote => vote.userId));
    return uniqueUserIds.size;
  },

  async getVotersByNominee(nomineeId: string, page: number = 1, limit: number = 20): Promise<{
    voters: Array<{ userId: string; quantity: number; type: string; createdAt: string; userEmail: string | null }>;
    total: number;
    totalPages: number;
  }> {
    interface ApiVoterRecord {
      userId?: string;
      id?: string;
      userEmail?: string | null;
      email?: string | null;
    }

    // Backend filters by nomineeId; fetch the requested page directly
    const response = await apiClient.get<VotesResponse | Vote[]>('/admin/votes', {
      params: { nomineeId, page, limit },
    });
    const allVotes: Vote[] = Array.isArray(response)
      ? response
      : (response as VotesResponse).votes || [];
    const paginationData = Array.isArray(response) ? undefined : (response as VotesResponse).pagination;

    // Aggregate by userId — sum quantities for this page
    const voterMap = new Map<string, { userId: string; quantity: number; type: string; createdAt: string }>();
    allVotes.forEach(vote => {
      const existing = voterMap.get(vote.userId);
      if (existing) {
        existing.quantity += vote.quantity;
      } else {
        voterMap.set(vote.userId, {
          userId: vote.userId,
          quantity: vote.quantity,
          type: vote.type,
          createdAt: vote.createdAt,
        });
      }
    });

    // Fetch voter records to enrich with email
    const votersResponse = await apiClient.get<{ voters?: ApiVoterRecord[]; data?: ApiVoterRecord[] } | ApiVoterRecord[]>('/admin/voters', { params: { limit: 1000 } });
    const rawVoterRecords: ApiVoterRecord[] =
      Array.isArray(votersResponse) ? votersResponse :
      (votersResponse as { voters?: ApiVoterRecord[] }).voters ??
      (votersResponse as { data?: ApiVoterRecord[] }).data ?? [];

    const emailMap = new Map<string, string | null>();
    rawVoterRecords.forEach(v => {
      const uid = v.userId ?? v.id;
      if (uid) emailMap.set(uid, v.userEmail ?? v.email ?? null);
    });

    const voters = Array.from(voterMap.values())
      .map(entry => ({ ...entry, userEmail: emailMap.get(entry.userId) ?? null }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = paginationData?.total ?? voters.length;
    const totalPages = paginationData?.totalPages ?? Math.max(1, Math.ceil(total / limit));

    return { voters, total, totalPages };
  },

  async getDashboard(): Promise<any> {
    const response = await apiClient.get('/admin/dashboard');
    return response;
  },
};
