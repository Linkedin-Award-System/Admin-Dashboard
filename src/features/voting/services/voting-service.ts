import { apiClient } from '@/lib/api-client-instance';
import type { VoteStats, VoteTimelineData, DateRange } from '../types';

export const votingService = {
  async getStats(dateRange?: DateRange): Promise<VoteStats[]> {
    const params = dateRange
      ? { startDate: dateRange.startDate, endDate: dateRange.endDate }
      : undefined;
    const response = await apiClient.get<VoteStats[]>('/votes/stats', { params });
    return response;
  },

  async getTimeline(dateRange?: DateRange): Promise<VoteTimelineData[]> {
    const params = dateRange
      ? { startDate: dateRange.startDate, endDate: dateRange.endDate }
      : undefined;
    const response = await apiClient.get<VoteTimelineData[]>('/votes/timeline', { params });
    return response;
  },

  async getUniqueVoterCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/votes/unique-voters');
    return response.count;
  },
};
