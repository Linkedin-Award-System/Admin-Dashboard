import { apiClient } from '@/lib/api-client-instance';
import type { PaymentTransaction, PaymentFilters } from '../types';

export const paymentService = {
  async getAll(filters?: PaymentFilters): Promise<PaymentTransaction[]> {
    const params = filters
      ? {
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
        }
      : undefined;
    const response = await apiClient.get<PaymentTransaction[]>('/payments', { params });
    return response;
  },

  async getById(id: string): Promise<PaymentTransaction> {
    const response = await apiClient.get<PaymentTransaction>(`/payments/${id}`);
    return response;
  },

  async getTotalRevenue(): Promise<number> {
    const response = await apiClient.get<{ totalRevenue: number }>('/payments/revenue');
    return response.totalRevenue;
  },
};
