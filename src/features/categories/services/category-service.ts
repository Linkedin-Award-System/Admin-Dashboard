import { apiClient } from '@/lib/api-client-instance';
import type { Category, CategoryFormData } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/admin/categories');
    return response;
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
