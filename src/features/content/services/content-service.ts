import { apiClient } from '@/lib/api-client-instance';
import type { LandingContent, ContentFormData } from '../types';

export const contentService = {
  async getCurrent(): Promise<LandingContent> {
    const response = await apiClient.get<LandingContent>('/content/current');
    return response;
  },

  async getVersionHistory(): Promise<LandingContent[]> {
    const response = await apiClient.get<LandingContent[]>('/content/versions');
    return response;
  },

  async update(content: ContentFormData): Promise<LandingContent> {
    const response = await apiClient.post<LandingContent>('/content', content);
    return response;
  },

  async publish(versionId: string): Promise<void> {
    await apiClient.post(`/content/${versionId}/publish`);
  },

  async revert(versionId: string): Promise<LandingContent> {
    const response = await apiClient.post<LandingContent>(`/content/${versionId}/revert`);
    return response;
  },
};
