import { apiClient } from '@/lib/api-client-instance';
import type { Category, CategoryFormData } from '../types';

interface CategoriesResponse {
  categories: Category[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

function unwrapCategories(raw: unknown): Category[] {
  let items: unknown[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj['categories'])) items = obj['categories'];
    else {
      for (const k of ['data', 'items', 'results']) {
        if (Array.isArray(obj[k])) { items = obj[k] as unknown[]; break; }
      }
    }
  }
  // Normalize nomineeCount — API may return _count.nominees instead
  return items.map((item) => {
    const c = item as Record<string, unknown>;
    const count = c['nomineeCount'] ??
      (c['_count'] as Record<string, unknown> | undefined)?.['nominees'] ?? 0;
    return { ...c, nomineeCount: Number(count) } as unknown as Category;
  });
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<CategoriesResponse | Category[]>('/admin/categories');
    return unwrapCategories(response);
  },

  async getById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/admin/categories/${id}`);
    return response;
  },

  async create(data: CategoryFormData): Promise<Category> {
    const response = await apiClient.post<Category>('/admin/categories', data);
    return response;
  },

  async update(id: string, data: CategoryFormData): Promise<Category> {
    const response = await apiClient.patch<Category>(`/admin/categories/${id}`, data);
    return response;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/categories/${id}`);
  },
};
