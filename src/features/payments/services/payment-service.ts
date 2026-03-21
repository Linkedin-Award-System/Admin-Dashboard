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

const CANONICAL_STATUSES = new Set(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']);

// Maps non-standard API status values (uppercased) to canonical ones
const STATUS_ALIAS_MAP: Record<string, PaymentTransaction['status']> = {
  SUCCESS: 'COMPLETED',
  PAID: 'COMPLETED',
  COMPLETE: 'COMPLETED',
  PROCESSING: 'PENDING',
  INITIATED: 'PENDING',
  CREATED: 'PENDING',
  ERROR: 'FAILED',
  DECLINED: 'FAILED',
  CANCELLED: 'FAILED',
  CANCELED: 'FAILED',
  REVERSED: 'REFUNDED',
  CHARGEBACK: 'REFUNDED',
};

function normalizeStatus(raw: string): PaymentTransaction['status'] {
  const upper = raw?.toUpperCase();
  if (CANONICAL_STATUSES.has(upper)) return upper as PaymentTransaction['status'];
  return STATUS_ALIAS_MAP[upper] ?? (upper as PaymentTransaction['status']);
}

export function unwrapPayments(raw: unknown): PaymentTransaction[] {
  let payments: PaymentTransaction[] = [];
  if (Array.isArray(raw)) {
    payments = raw as PaymentTransaction[];
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    // Handle { data: { payments: [...] } } — the actual API response shape
    if (obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])) {
      const data = obj['data'] as Record<string, unknown>;
      if (Array.isArray(data['payments'])) {
        payments = data['payments'] as PaymentTransaction[];
      } else {
        for (const k of ['data', 'items', 'results']) {
          if (Array.isArray(data[k])) { payments = data[k] as PaymentTransaction[]; break; }
        }
      }
    } else if (Array.isArray(obj['payments'])) {
      payments = obj['payments'] as PaymentTransaction[];
    } else {
      for (const k of ['data', 'items', 'results']) {
        if (Array.isArray(obj[k])) { payments = obj[k] as PaymentTransaction[]; break; }
      }
    }
  }
  return payments.map((p) => ({
    ...p,
    txRef: p.txRef ?? '',
    userId: p.userId ?? '',
    packageId: p.packageId ?? '',
    currency: p.currency ?? 'ETB',
    amount: p.amount ?? 0,
    status: normalizeStatus((p.status as string) ?? ''),
  }));
}

function unwrapUsers(raw: unknown): { id: string; email: string }[] {
  if (Array.isArray(raw)) return raw as { id: string; email: string }[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    for (const k of ['users', 'data', 'items', 'results']) {
      if (Array.isArray(obj[k])) return obj[k] as { id: string; email: string }[];
    }
  }
  return [];
}

export const paymentService = {
  async getUsers(): Promise<{ id: string; email: string }[]> {
    const response = await apiClient.get<unknown>('/admin/users');
    return unwrapUsers(response);
  },

  async getAll(filters?: PaymentFilters): Promise<PaymentTransaction[]> {
    const params = filters
      ? {
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: filters.page || 1,
          limit: filters.limit || 500,
        }
      : { page: 1, limit: 500 };
    const response = await apiClient.get<PaymentsResponse | PaymentTransaction[]>('/admin/payments', { params });
    const payments = unwrapPayments(response);
    // Sort newest first
    return payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
