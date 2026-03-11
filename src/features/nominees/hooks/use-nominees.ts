import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nomineeService } from '../services/nominee-service';
import type { NomineeFormData } from '../types';

const NOMINEES_QUERY_KEY = ['nominees'];

export const useNominees = (categoryId?: string) => {
  return useQuery({
    queryKey: categoryId ? [...NOMINEES_QUERY_KEY, { categoryId }] : NOMINEES_QUERY_KEY,
    queryFn: () => nomineeService.getAll(categoryId),
    staleTime: 60000, // 60 seconds
  });
};

export const useNominee = (id: string) => {
  return useQuery({
    queryKey: [...NOMINEES_QUERY_KEY, id],
    queryFn: () => nomineeService.getById(id),
    enabled: !!id,
  });
};

export const useCreateNominee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NomineeFormData) => nomineeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOMINEES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateNominee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NomineeFormData }) =>
      nomineeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOMINEES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteNominee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => nomineeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOMINEES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
