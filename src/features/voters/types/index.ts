export interface VoteRecord {
  id?: string;
  nomineeId: string;
  nomineeName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  type: 'FREE' | 'PREMIUM';
  createdAt: string;
}

export interface Voter {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  totalVotes: number;
  totalSpent: number;
  firstVotedAt: string | null;
  lastVotedAt: string | null;
  // Embedded votes — populated lazily via /admin/voters/:userId/votes
  votes: VoteRecord[];
}

export interface VoterVotesResponse {
  votes: VoteRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VotersResponse {
  voters: Voter[];
  total: number;
  totalPages: number;
}

export interface VoterStats {
  totalVoters: number;
  totalVotes: number;
  totalSpent: number;
}
