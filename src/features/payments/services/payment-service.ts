import { apiClient } from '@/lib/api-client-instance';
import type { PaymentTransaction, PaymentFilters } from '../types';

interface PaymentsResponse {
  payments: PaymentTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const paymentService = {
  async getAll(filters?: PaymentFilters): Promise<PaymentTransaction[]> {
    const params = filters
      ? {
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: filters.page || 1,
          limit: filters.limit || 50,
        }
      : { page: 1, limit: 50 };
    const response = await apiClient.get<PaymentsResponse>('/admin/payments', { params });
    return response.payments;
  },

  async getById(id: string): Promise<PaymentTransaction> {
    const response = await apiClient.get<PaymentTransaction>(`/admin/payments/${id}`);
    return response;
  },

  async getTotalRevenue(): Promise<number> {
    // Use /admin/payments and calculate revenue client-side (only COMPLETED payments)
    const response = await apiClient.get<PaymentsResponse>('/admin/payments', { 
      params: { status: 'COMPLETED', limit: 1000 } 
    });
    const payments = response.payments || [];
    
    // Sum up all completed payment amounts
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    return totalRevenue;
  },
};
