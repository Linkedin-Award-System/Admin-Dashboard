export interface VoteStats {
  categoryId: string;
  categoryName: string;
  totalVotes: number;
  nominees: NomineeVoteData[];
  leadingNominee: {
    id: string;
    name: string;
    voteCount: number;
  };
}

export interface NomineeVoteData {
  nomineeId: string;
  nomineeName: string;
  voteCount: number;
  percentage: number;
}

export interface VoteTimelineData {
  timestamp: string;
  voteCount: number;
  categoryId?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
