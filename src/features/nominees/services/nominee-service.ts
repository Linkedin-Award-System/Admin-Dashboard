import { apiClient } from '@/lib/api-client-instance';
import type { Nominee, NomineeFormData } from '../types';

interface NomineesResponse {
  nominees: Nominee[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

function unwrapNominees(raw: unknown): Nominee[] {
  if (Array.isArray(raw)) return raw as Nominee[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj['nominees'])) return obj['nominees'] as Nominee[];
    for (const k of ['data', 'items', 'results']) {
      if (Array.isArray(obj[k])) return obj[k] as Nominee[];
    }
  }
  return [];
}

export const nomineeService = {
  async getAll(categoryId?: string): Promise<Nominee[]> {
    // Always fetch all nominees — backend may not support categoryId filtering
    const params: Record<string, string> = { limit: '500' };
    const response = await apiClient.get<NomineesResponse | Nominee[]>('/admin/nominees', { params });
    const all = unwrapNominees(response);
    // Filter client-side if a categoryId is provided
    if (!categoryId) return all;
    return all.filter((n) =>
      n.categories?.some((c) =>
        typeof c === 'string' ? c === categoryId : c.id === categoryId
      )
    );
  },

  async getById(id: string): Promise<Nominee> {
    // Backend doesn't support GET /admin/nominees/:id — fetch fresh list and find by id
    const params: Record<string, string> = { limit: '500' };
    const response = await apiClient.get<NomineesResponse | Nominee[]>('/admin/nominees', { params });
    const all = unwrapNominees(response);
    const found = all.find((n) => n.id === id);
    if (!found) throw new Error('Nominee not found');
    return found;
  },

  async create(data: NomineeFormData): Promise<Nominee> {
    const response = await apiClient.post<Nominee>('/admin/nominees', data);
    return response;
  },

  async update(id: string, data: NomineeFormData): Promise<Nominee> {
    const response = await apiClient.patch<Nominee>(`/admin/nominees/${id}`, data);
    return response;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/nominees/${id}`);
  },
};
