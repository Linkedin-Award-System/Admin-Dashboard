import { useQuery } from '@tanstack/react-query';
import { votingService } from '../services/voting-service';
import type { DateRange } from '../types';

const VOTE_STATS_QUERY_KEY = ['vote-stats'];
const VOTE_TIMELINE_QUERY_KEY = ['vote-timeline'];
const UNIQUE_VOTERS_QUERY_KEY = ['unique-voters'];

export const useVoteStats = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: dateRange 
      ? [...VOTE_STATS_QUERY_KEY, dateRange] 
      : VOTE_STATS_QUERY_KEY,
    queryFn: () => votingService.getStats(dateRange),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 30000,
  });
};

export const useVoteTimeline = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: dateRange 
      ? [...VOTE_TIMELINE_QUERY_KEY, dateRange] 
      : VOTE_TIMELINE_QUERY_KEY,
    queryFn: () => votingService.getTimeline(dateRange),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 30000,
  });
};

export const useUniqueVoterCount = () => {
  return useQuery({
    queryKey: UNIQUE_VOTERS_QUERY_KEY,
    queryFn: votingService.getUniqueVoterCount,
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 30000,
  });
};

export const useVotersByNominee = (nomineeId: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['voters-by-nominee', nomineeId, page, limit],
    queryFn: () => votingService.getVotersByNominee(nomineeId, page, limit),
    enabled: !!nomineeId,
    staleTime: 0, // always fetch fresh — ensures new nominees show 0 voters
  });
};
