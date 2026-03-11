import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../services/content-service';
import type { ContentFormData } from '../types';

const CONTENT_QUERY_KEY = ['content'];
const VERSION_HISTORY_QUERY_KEY = ['content', 'versions'];

export const useCurrentContent = () => {
  return useQuery({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: contentService.getCurrent,
    staleTime: 60000, // 60 seconds
  });
};

export const useVersionHistory = () => {
  return useQuery({
    queryKey: VERSION_HISTORY_QUERY_KEY,
    queryFn: contentService.getVersionHistory,
    staleTime: 60000,
  });
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContentFormData) => contentService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VERSION_HISTORY_QUERY_KEY });
    },
  });
};

export const usePublishContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versionId: string) => contentService.publish(versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VERSION_HISTORY_QUERY_KEY });
    },
  });
};

export const useRevertContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versionId: string) => contentService.revert(versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VERSION_HISTORY_QUERY_KEY });
    },
  });
};
