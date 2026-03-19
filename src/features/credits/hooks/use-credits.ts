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
  const { success } = useToast();

  return useMutation({
    mutationFn: (data: CreditPackageFormData): Promise<CreditPackage> =>
      creditService.create(data),
    onSuccess: (newPkg) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      success('Package created', `"${newPkg.name}" has been added.`);
    },
  });
};

export const useUpdateCreditPackage = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreditPackageFormData> }): Promise<CreditPackage> =>
      creditService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      success('Package updated', `"${updated.name}" has been updated.`);
    },
  });
};

export const useDeleteCreditPackage = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: (id: string): Promise<void> =>
      creditService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      success('Package deleted', 'Credit package has been removed.');
    },
  });
};

export const useToggleCreditPackageActive = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }): Promise<CreditPackage> =>
      creditService.update(id, { isActive }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      success('Status updated', `Package has been ${updated.isActive ? 'activated' : 'deactivated'}.`);
    },
  });
};

export const useToggleCreditPackagePopular = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: ({ id, isPopular }: { id: string; isPopular: boolean }): Promise<CreditPackage> =>
      creditService.update(id, { isPopular }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      success('Featured updated', `Package has been ${updated.isPopular ? 'featured' : 'unfeatured'}.`);
    },
  });
};
