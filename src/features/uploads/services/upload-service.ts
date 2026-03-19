/**
 * Upload Service
 * Handles file uploads to the server
 * Uses multipart/form-data for image uploads
 */

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export type UploadBucket = 'GENERAL' | 'NOMINEE_PROFILE' | 'CATEGORY_IMAGE' | 'BANNER_IMAGE' | 'SPONSOR_LOGO';

export const uploadService = {
  /**
   * Upload an image file to the server
   * @param file - The file to upload
   * @param bucket - The storage bucket (default: GENERAL)
   * @returns Upload response with file URL
   */
  async uploadImage(file: File, bucket: UploadBucket = 'GENERAL'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    // Use fetch directly for FormData — go through the Vite proxy (/api/...) to avoid CORS
    const response = await fetch('/api/admin/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Failed to upload image' } }));
      throw new Error(error.error?.message || 'Failed to upload image');
    }

    const data = await response.json();
    const result: UploadResponse = data.data;

    // Return the full absolute URL as-is so it gets stored in the DB.
    // The public Vercel site needs the absolute Railway URL to load images directly.
    // Admin dashboard display components use resolveImageUrl() to rewrite it
    // to a relative proxy path for local/dev rendering.

    return result;
  },

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @param maxSizeMB - Maximum file size in MB (default: 5)
   * @returns Validation result
   */
  validateImage(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.',
      };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB. Please upload a smaller image.`,
      };
    }

    return { valid: true };
  },
};
