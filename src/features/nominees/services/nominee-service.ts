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
    return all.filter((n) => {
      // Check categories array (objects or strings)
      if (n.categories?.some((c) =>
        typeof c === 'string' ? c === categoryId : c.id === categoryId
      )) return true;
      // Also check raw categoryIds field that some API responses include
      const raw = n as unknown as Record<string, unknown>;
      if (Array.isArray(raw['categoryIds'])) {
        return (raw['categoryIds'] as string[]).includes(categoryId);
      }
      return false;
    });
  },

  async getById(id: string): Promise<Nominee> {
    const response = await apiClient.get<Nominee>(`/admin/nominees/${id}`);
    return response;
  },

  async create(data: NomineeFormData): Promise<Nominee> {
    const response = await apiClient.post<Nominee>('/admin/nominees', data);
    return response;
  },

  async update(id: string, data: NomineeFormData): Promise<Nominee> {
    // Build a clean payload — strip undefined/empty optional fields and
    // sanitize profileImageUrl (LinkedIn CDN URLs contain query params that
    // some backend validators reject; strip them to just the base URL path).
    const payload: Record<string, unknown> = {
      fullName: data.fullName,
      linkedInProfileUrl: data.linkedInProfileUrl,
      shortBiography: data.shortBiography,
      categoryIds: data.categoryIds,
    };

    if (data.organization) {
      payload.organization = data.organization;
    }

    if (data.profileImageUrl) {
      // Pass through any stored URL (Railway uploads, CDN, etc.) as-is.
      // LinkedIn CDN URLs are already converted to permanent stored URLs
      // by the Fetch & Upload flow before reaching here, so no special
      // handling is needed.
      payload.profileImageUrl = data.profileImageUrl;
    }

    const response = await apiClient.patch<Nominee>(`/admin/nominees/${id}`, payload);
    return response;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/nominees/${id}`);
  },
};
