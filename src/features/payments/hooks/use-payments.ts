import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../services/payment-service';
import type { PaymentFilters } from '../types';

const PAYMENTS_QUERY_KEY = ['payments'];
const TOTAL_REVENUE_QUERY_KEY = ['total-revenue'];

export const usePayments = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: filters 
      ? [...PAYMENTS_QUERY_KEY, filters] 
      : PAYMENTS_QUERY_KEY,
    queryFn: () => paymentService.getAll(filters),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 30000,
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, id],
    queryFn: () => paymentService.getById(id),
    enabled: !!id,
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 30000,
  });
};

export const useTotalRevenue = () => {
  return useQuery({
    queryKey: TOTAL_REVENUE_QUERY_KEY,
    queryFn: paymentService.getTotalRevenue,
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 30000,
  });
};
