import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { voterService } from '../services/voter-service';

export const useVoters = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['voters', page, limit, search],
    queryFn: () => voterService.getAll(page, limit, search),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
};
