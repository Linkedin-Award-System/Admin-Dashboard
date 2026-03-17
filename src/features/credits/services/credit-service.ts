import { apiClient } from '@/lib/api-client-instance';

export interface CreditPackage {
  id: string;
  name: string;
  description?: string;
  credits: number;
  price: number;
  currency?: string;
  isPopular?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreditPackageFormData {
  name: string;
  description?: string;
  credits: number;
  price: number;
  currency?: string;
  isPopular?: boolean;
  isActive?: boolean;
}

function unwrap(raw: unknown): CreditPackage[] {
  if (Array.isArray(raw)) return raw as CreditPackage[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    for (const k of ['packages', 'creditPackages', 'data', 'items', 'results']) {
      if (Array.isArray(obj[k])) return obj[k] as CreditPackage[];
    }
  }
  return [];
}

function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const creditService = {
  /** Public read — fetches from backend */
  async getAll(): Promise<CreditPackage[]> {
    const res = await apiClient.get('/public/credit-packages');
    return unwrap(res);
  },

  /**
   * Admin mutations — backend endpoints don't exist yet.
   * These operate purely in-memory; React Query cache is the source of truth.
   */
  createLocal(data: CreditPackageFormData): CreditPackage {
    return {
      id: generateId(),
      ...data,
      currency: data.currency ?? 'ETB',
      isActive: data.isActive !== false,
      isPopular: data.isPopular ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateLocal(existing: CreditPackage, data: Partial<CreditPackageFormData>): CreditPackage {
    return { ...existing, ...data, updatedAt: new Date().toISOString() };
  },
};
