/**
 * Upload Feature Types
 */

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export type UploadBucket = 'GENERAL' | 'NOMINEES' | 'SPONSORS' | 'BANNERS';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
