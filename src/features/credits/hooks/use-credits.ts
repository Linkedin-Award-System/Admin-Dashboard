import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditService, type CreditPackage, type CreditPackageFormData } from '../services/credit-service';
import { useToast } from '@/shared/hooks/use-toast-hook';

const QUERY_KEY = ['credit-packages'];

export const useCreditPackages = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: creditService.getAll,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateCreditPackage = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  return useMutation({
    mutationFn: (data: CreditPackageFormData): Promise<CreditPackage> =>
      creditService.create(data),
    onSuccess: (newPkg, vars) => {
      // Merge server response with submitted data — backend may not echo back all fields
      const merged: CreditPackage = {
        ...newPkg,
        isActive: newPkg.isActive ?? vars.isActive,
        isPopular: newPkg.isPopular ?? vars.isPopular,
      };
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old => [...(old ?? []), merged]);
      success('Package created', `"${merged.name}" has been added.`);
    },
    onError: (err) => {
      toastError('Failed to create package', err instanceof Error ? err.message : 'An unexpected error occurred.');
    },
  });
};

export const useUpdateCreditPackage = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreditPackageFormData> }): Promise<CreditPackage> =>
      creditService.update(id, data),
    onSuccess: (updated, vars) => {
      // Merge server response with submitted data as fallback — backend may not echo back all fields
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.map(p =>
          p.id === vars.id
            ? {
                ...p,
                ...updated,
                isActive: updated.isActive ?? vars.data.isActive ?? p.isActive,
                isPopular: updated.isPopular ?? vars.data.isPopular ?? p.isPopular,
              }
            : p
        ) ?? []
      );
      success('Package updated', `"${updated.name}" has been updated.`);
    },
    onError: (err) => {
      toastError('Failed to update package', err instanceof Error ? err.message : 'An unexpected error occurred.');
    },
  });
};

export const useDeleteCreditPackage = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  return useMutation({
    mutationFn: (id: string): Promise<void> =>
      creditService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      success('Package deleted', 'Credit package has been removed.');
    },
    onError: (err) => {
      toastError('Failed to delete package', err instanceof Error ? err.message : 'Could not delete the package. Please try again.');
    },
  });
};

export const useToggleCreditPackageActive = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }): Promise<CreditPackage> =>
      creditService.update(id, { isActive }),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<CreditPackage[]>(QUERY_KEY);
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.map(p => p.id === id ? { ...p, isActive } : p) ?? []
      );
      return { previous };
    },
    onSuccess: (updated, vars) => {
      // Merge server response but keep mutation value as fallback if backend omits the field
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.map(p =>
          p.id === vars.id
            ? { ...p, ...updated, isActive: updated.isActive ?? vars.isActive }
            : p
        ) ?? []
      );
      const isActive = updated.isActive ?? vars.isActive;
      success('Status updated', `Package has been ${isActive ? 'activated' : 'deactivated'}.`);
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(QUERY_KEY, ctx.previous);
      toastError('Update failed', 'Could not update package status. Please try again.');
    },
  });
};

export const useToggleCreditPackagePopular = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  return useMutation({
    mutationFn: ({ id, isPopular }: { id: string; isPopular: boolean }): Promise<CreditPackage> =>
      creditService.update(id, { isPopular }),
    onMutate: async ({ id, isPopular }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<CreditPackage[]>(QUERY_KEY);
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.map(p => p.id === id ? { ...p, isPopular } : p) ?? []
      );
      return { previous };
    },
    onSuccess: (updated, vars) => {
      // Merge server response but keep mutation value as fallback if backend omits the field
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.map(p =>
          p.id === vars.id
            ? { ...p, ...updated, isPopular: updated.isPopular ?? vars.isPopular }
            : p
        ) ?? []
      );
      const isPopular = updated.isPopular ?? vars.isPopular;
      success('Featured updated', `Package has been ${isPopular ? 'featured' : 'unfeatured'}.`);
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(QUERY_KEY, ctx.previous);
      toastError('Update failed', 'Could not update featured status. Please try again.');
    },
  });
};
