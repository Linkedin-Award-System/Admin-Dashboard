import { apiClient } from '@/lib/api-client-instance';
import type { Nominee, NomineeFormData } from '../types';

export const nomineeService = {
  async getAll(categoryId?: string): Promise<Nominee[]> {
    const url = categoryId ? `/nominees?categoryId=${categoryId}` : '/nominees';
    const response = await apiClient.get<Nominee[]>(url);
    return response;
  },

  async getById(id: string): Promise<Nominee> {
    const response = await apiClient.get<Nominee>(`/nominees/${id}`);
    return response;
  },

  async create(data: NomineeFormData): Promise<Nominee> {
    const response = await apiClient.post<Nominee>('/nominees', data);
    return response;
  },

  async update(id: string, data: NomineeFormData): Promise<Nominee> {
    const response = await apiClient.put<Nominee>(`/nominees/${id}`, data);
    return response;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/nominees/${id}`);
  },
};
