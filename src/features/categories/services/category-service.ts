import { apiClient } from '@/lib/api-client-instance';
import type { Category, CategoryFormData } from '../types';

interface CategoriesResponse {
  categories: Category[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

function unwrapCategories(raw: unknown): Category[] {
  if (Array.isArray(raw)) return raw as Category[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj['categories'])) return obj['categories'] as Category[];
    for (const k of ['data', 'items', 'results']) {
      if (Array.isArray(obj[k])) return obj[k] as Category[];
    }
  }
  return [];
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
