import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nomineeService } from '../services/nominee-service';
import type { NomineeFormData, Nominee } from '../types';
import type { Category } from '@/features/categories/types';
import { useToast } from '@/shared/hooks/use-toast-hook';

const NOMINEES_QUERY_KEY = ['nominees'];

export const useNominees = (categoryId?: string) => {
  return useQuery({
    queryKey: categoryId ? [...NOMINEES_QUERY_KEY, { categoryId }] : NOMINEES_QUERY_KEY,
    queryFn: () => nomineeService.getAll(categoryId),
    staleTime: 60000, // 60 seconds
  });
};

export const useNominee = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...NOMINEES_QUERY_KEY, id],
    queryFn: async () => {
      // Try to find in the already-cached list first (avoids extra network call)
      const cached = queryClient.getQueryData<Nominee[]>(NOMINEES_QUERY_KEY);
      if (cached) {
        const found = cached.find((n) => n.id === id);
        if (found) return found;
      }
      // Not in cache — fetch fresh list from API and find by id
      return nomineeService.getById(id);
    },
    enabled: !!id,
    staleTime: 0, // always re-validate so newly created nominees are found immediately
  });
};

export const useCreateNominee = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: NomineeFormData) => nomineeService.create(data),
    onMutate: async (newNominee) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: NOMINEES_QUERY_KEY });

      // Snapshot previous value
      const previousNominees = queryClient.getQueryData(NOMINEES_QUERY_KEY);

      // Look up real category names from the categories cache
      const cachedCategories = queryClient.getQueryData<Category[]>(['categories']) ?? [];
      const catNameMap = new Map(cachedCategories.map((c) => [c.id, c.name]));

      // Optimistically update to the new value
      queryClient.setQueryData(NOMINEES_QUERY_KEY, (old: Nominee[] | undefined) => {
        const optimisticNominee = {
          id: `temp-${Date.now()}`,
          ...newNominee,
          // Use real category names if available, otherwise leave name blank (not the raw ID)
          categories: newNominee.categoryIds.map((id) => ({
            id,
            name: catNameMap.get(id) ?? '',
          })),
          voteCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return old ? [...old, optimisticNominee] : [optimisticNominee];
      });

      return { previousNominees };
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: NOMINEES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['voting'] });
      success('Nominee created', 'The nominee has been created successfully.');
    },
    onError: (err: Error, _newNominee, context) => {
      // Rollback on error
      if (context?.previousNominees) {
        queryClient.setQueryData(NOMINEES_QUERY_KEY, context.previousNominees);
      }
      error('Failed to create nominee', err.message);
    },
  });
};

export const useUpdateNominee = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NomineeFormData }) =>
      nomineeService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: NOMINEES_QUERY_KEY });
      const previousNominees = queryClient.getQueryData(NOMINEES_QUERY_KEY);

      // Look up real category names from the categories cache
      const cachedCategories = queryClient.getQueryData<Category[]>(['categories']) ?? [];
      const catNameMap = new Map(cachedCategories.map((c) => [c.id, c.name]));

      queryClient.setQueryData(NOMINEES_QUERY_KEY, (old: Nominee[] | undefined) => {
        if (!old) return old;
        return old.map((nominee: Nominee) => {
          if (nominee.id !== id) return nominee;

          // Use real category names from cache; fall back to existing name if already known; hide if unknown
          const existingCatMap = new Map(nominee.categories.map(c => [c.id, c.name]));
          const updatedCategories = data.categoryIds.map(catId => ({
            id: catId,
            name: catNameMap.get(catId) ?? existingCatMap.get(catId) ?? '',
          }));

          return {
            ...nominee,
            fullName: data.fullName,
            linkedInProfileUrl: data.linkedInProfileUrl,
            shortBiography: data.shortBiography,
            organization: data.organization,
            profileImageUrl: data.profileImageUrl ?? nominee.profileImageUrl,
            categories: updatedCategories,
            updatedAt: new Date().toISOString(),
          };
        });
      });

      return { previousNominees };
    },
    onSuccess: (serverData, { id, data }) => {
      // Merge server response into cache — if backend doesn't return profileImageUrl,
      // preserve the one we submitted so it survives until the next full refetch
      queryClient.setQueryData(NOMINEES_QUERY_KEY, (old: Nominee[] | undefined) => {
        if (!old) return old;
        return old.map((nominee: Nominee) => {
          if (nominee.id !== id) return nominee;
          return {
            ...nominee,
            ...serverData,
            // Preserve submitted profileImageUrl if server response omits it
            profileImageUrl: serverData?.profileImageUrl ?? data.profileImageUrl ?? nominee.profileImageUrl,
          };
        });
      });
      // Also update the individual nominee cache entry if it exists
      queryClient.setQueryData([...NOMINEES_QUERY_KEY, id], (old: Nominee | undefined) => {
        if (!old) return old;
        return {
          ...old,
          ...serverData,
          profileImageUrl: serverData?.profileImageUrl ?? data.profileImageUrl ?? old.profileImageUrl,
        };
      });
      queryClient.invalidateQueries({ queryKey: NOMINEES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['voting'] });
      success('Nominee updated', 'The nominee has been updated successfully.');
    },
    onError: (err: Error, _variables, context) => {
      if (context?.previousNominees) {
        queryClient.setQueryData(NOMINEES_QUERY_KEY, context.previousNominees);
      }
      error('Failed to update nominee', err.message);
    },
  });
};

export const useDeleteNominee = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => nomineeService.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: NOMINEES_QUERY_KEY });

      // Snapshot previous value
      const previousNominees = queryClient.getQueryData(NOMINEES_QUERY_KEY);

      // Optimistically remove the nominee
      queryClient.setQueryData(NOMINEES_QUERY_KEY, (old: Nominee[] | undefined) => {
        if (!old) return old;
        return old.filter((nominee: Nominee) => nominee.id !== id);
      });

      return { previousNominees };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOMINEES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['voting'] });
      success('Nominee deleted', 'The nominee has been deleted successfully.');
    },
    onError: (err: Error, _id, context) => {
      // Rollback on error
      if (context?.previousNominees) {
        queryClient.setQueryData(NOMINEES_QUERY_KEY, context.previousNominees);
      }
      error('Failed to delete nominee', err.message);
    },
  });
};
