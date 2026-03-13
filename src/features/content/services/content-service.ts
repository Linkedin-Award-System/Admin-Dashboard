import { apiClient } from '@/lib/api-client-instance';
import type { LandingContent, ContentFormData } from '../types';

export const contentService = {
  async getCurrent(): Promise<LandingContent> {
    const response = await apiClient.get<LandingContent>('/admin/content/settings');
    return response;
  },

  async getVersionHistory(): Promise<LandingContent[]> {
    const response = await apiClient.get<LandingContent[]>('/admin/content/versions');
    return response;
  },

  async update(content: ContentFormData): Promise<LandingContent> {
    const response = await apiClient.patch<LandingContent>('/admin/content/settings', content);
    return response;
  },

  async publish(versionId: string): Promise<void> {
    await apiClient.post(`/admin/content/${versionId}/publish`);
  },

  async revert(versionId: string): Promise<LandingContent> {
    const response = await apiClient.post<LandingContent>(`/admin/content/${versionId}/revert`);
    return response;
  },
};
