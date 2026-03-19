import { apiClient } from '@/lib/api-client-instance';
import type { Voter, VotersResponse, VoterStats, VoteRecord, VoterVotesResponse } from '../types';

interface ApiVoter {
  userId?: string;
  id?: string;
  userName?: string | null;
  email?: string | null;
  userEmail?: string | null;
  totalVotes?: number;
  totalSpent?: number;
  firstVotedAt?: string | null;
  lastVotedAt?: string | null;
}

interface ApiVotersResponse {
  voters?: ApiVoter[];
  data?: ApiVoter[];
  items?: ApiVoter[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  total?: number;
  totalPages?: number;
}

interface ApiVoteRecord {
  id?: string;
  nomineeId?: string;
  nomineeName?: string;
  categoryId?: string;
  categoryName?: string;
  quantity?: number;
  type?: 'FREE' | 'PREMIUM';
  createdAt?: string;
}

interface ApiVoterVotesResponse {
  votes?: ApiVoteRecord[];
  data?: ApiVoteRecord[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

function mapApiVoter(v: ApiVoter): Voter {
  return {
    userId: v.userId ?? v.id ?? '',
    userName: v.userName ?? null,
    userEmail: v.userEmail ?? v.email ?? null,
    totalVotes: v.totalVotes ?? 0,
    totalSpent: v.totalSpent ?? 0,
    firstVotedAt: v.firstVotedAt ?? null,
    lastVotedAt: v.lastVotedAt ?? null,
    votes: [], // populated lazily via getVotes()
  };
}

function mapApiVoteRecord(v: ApiVoteRecord): VoteRecord {
  return {
    id: v.id,
    nomineeId: v.nomineeId ?? '',
    nomineeName: v.nomineeName ?? 'Unknown Nominee',
    categoryId: v.categoryId ?? '',
    categoryName: v.categoryName ?? 'Unknown Category',
    quantity: v.quantity ?? 1,
    type: v.type ?? 'FREE',
    createdAt: v.createdAt ?? new Date().toISOString(),
  };
}

export const voterService = {
  async getAll(page: number = 1, limit: number = 25, search: string = ''): Promise<VotersResponse> {
    const params: Record<string, unknown> = { page, limit };
    if (search.trim()) params.search = search.trim();

    const response = await apiClient.get<ApiVotersResponse>('/admin/voters', { params });

    const rawVoters: ApiVoter[] =
      (response as ApiVotersResponse).voters ??
      (response as ApiVotersResponse).data ??
      (response as ApiVotersResponse).items ??
      (Array.isArray(response) ? response : []);

    const voters = rawVoters.map(mapApiVoter);

    const pagination = (response as ApiVotersResponse).pagination;
    const total = pagination?.total ?? (response as ApiVotersResponse).total ?? voters.length;
    const totalPages =
      pagination?.totalPages ??
      (response as ApiVotersResponse).totalPages ??
      Math.max(1, Math.ceil(total / limit));

    return { voters, total, totalPages };
  },

  async getVotes(
    userId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<VoterVotesResponse> {
    const response = await apiClient.get<ApiVoterVotesResponse>(
      `/admin/voters/${userId}/votes`,
      { params: { page, limit } }
    );

    const rawVotes: ApiVoteRecord[] =
      (response as ApiVoterVotesResponse).votes ??
      (response as ApiVoterVotesResponse).data ??
      (Array.isArray(response) ? response : []);

    const votes = rawVotes.map(mapApiVoteRecord);

    const pagination = (response as ApiVoterVotesResponse).pagination ?? {
      page,
      limit,
      total: votes.length,
      totalPages: Math.max(1, Math.ceil(votes.length / limit)),
    };

    return { votes, pagination };
  },
};

export function getStats(voters: Voter[]): VoterStats {
  return {
    totalVoters: voters.length,
    totalVotes: voters.reduce((sum, v) => sum + v.totalVotes, 0),
    totalSpent: voters.reduce((sum, v) => sum + v.totalSpent, 0),
  };
}
