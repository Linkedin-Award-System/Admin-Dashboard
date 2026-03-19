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

export const creditService = {
  /** Admin read — fetches from backend */
  async getAll(): Promise<CreditPackage[]> {
    const res = await apiClient.get('/admin/credit-packages');
    return unwrap(res);
  },

  /** Create a new credit package */
  async create(data: CreditPackageFormData): Promise<CreditPackage> {
    return apiClient.post<CreditPackage>('/admin/credit-packages', data);
  },

  /** Update an existing credit package */
  async update(id: string, data: Partial<CreditPackageFormData>): Promise<CreditPackage> {
    return apiClient.patch<CreditPackage>(`/admin/credit-packages/${id}`, data);
  },

  /** Delete a credit package */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/credit-packages/${id}`);
  },

  /** @deprecated — kept as stub; use create() instead */
  createLocal(_data: CreditPackageFormData): never {
    throw new Error('createLocal is deprecated. Use creditService.create() to persist to the backend.');
  },

  /** @deprecated — kept as stub; use update() instead */
  updateLocal(_existing: CreditPackage, _data: Partial<CreditPackageFormData>): never {
    throw new Error('updateLocal is deprecated. Use creditService.update() to persist to the backend.');
  },
};
