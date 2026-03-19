/**
 * Upload Feature Types
 */

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export type UploadBucket = 'GENERAL' | 'NOMINEE_PROFILE' | 'CATEGORY_IMAGE' | 'BANNER_IMAGE' | 'SPONSOR_LOGO';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
