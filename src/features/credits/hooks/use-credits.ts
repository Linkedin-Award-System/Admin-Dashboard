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

/** Create — local only (no backend endpoint exists) */
export const useCreateCreditPackage = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: async (data: CreditPackageFormData): Promise<CreditPackage> => {
      return creditService.createLocal(data);
    },
    onSuccess: (newPkg) => {
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old ? [...old, newPkg] : [newPkg]
      );
      success('Package created', `"${newPkg.name}" has been added.`);
    },
  });
};

/** Update — local only */
export const useUpdateCreditPackage = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreditPackageFormData> }): Promise<CreditPackage> => {
      const current = queryClient.getQueryData<CreditPackage[]>(QUERY_KEY);
      const existing = current?.find(p => p.id === id);
      if (!existing) throw new Error('Package not found');
      return creditService.updateLocal(existing, data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.map(p => (p.id === updated.id ? updated : p))
      );
      success('Package updated', `"${updated.name}" has been updated.`);
    },
  });
};

/** Delete — local only */
export const useDeleteCreditPackage = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<string> => id,
    onSuccess: (id) => {
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.filter(p => p.id !== id)
      );
      success('Package deleted', 'Credit package has been removed.');
    },
  });
};

/** Toggle active — local only */
export const useToggleCreditPackageActive = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }): Promise<{ id: string; isActive: boolean }> =>
      ({ id, isActive }),
    onSuccess: ({ id, isActive }) => {
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.map(p => (p.id === id ? { ...p, isActive } : p))
      );
      success('Status updated', `Package has been ${isActive ? 'activated' : 'deactivated'}.`);
    },
  });
};

/** Toggle popular — local only */
export const useToggleCreditPackagePopular = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: async ({ id, isPopular }: { id: string; isPopular: boolean }): Promise<{ id: string; isPopular: boolean }> =>
      ({ id, isPopular }),
    onSuccess: ({ id, isPopular }) => {
      queryClient.setQueryData<CreditPackage[]>(QUERY_KEY, old =>
        old?.map(p => (p.id === id ? { ...p, isPopular } : p))
      );
      success('Featured updated', `Package has been ${isPopular ? 'featured' : 'unfeatured'}.`);
    },
  });
};
