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

function unwrapPayments(raw: unknown): PaymentTransaction[] {
  if (Array.isArray(raw)) return raw as PaymentTransaction[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj['payments'])) return obj['payments'] as PaymentTransaction[];
    for (const k of ['data', 'items', 'results']) {
      if (Array.isArray(obj[k])) return obj[k] as PaymentTransaction[];
    }
  }
  return [];
}

export const paymentService = {
  async getAll(filters?: PaymentFilters): Promise<PaymentTransaction[]> {
    const params = filters
      ? {
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: filters.page || 1,
          limit: filters.limit || 100,
        }
      : { page: 1, limit: 100 };
    const response = await apiClient.get<PaymentsResponse | PaymentTransaction[]>('/admin/payments', { params });
    return unwrapPayments(response);
  },

  async getById(id: string): Promise<PaymentTransaction> {
    const response = await apiClient.get<PaymentTransaction>(`/admin/payments/${id}`);
    return response;
  },

  async getTotalRevenue(): Promise<number> {
    const response = await apiClient.get<PaymentsResponse | PaymentTransaction[]>('/admin/payments', {
      params: { status: 'COMPLETED', limit: 1000 },
    });
    const payments = unwrapPayments(response);
    return payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  },
};
