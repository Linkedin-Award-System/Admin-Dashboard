/**
 * PDF Generation Utility
 * Generates PDF files via server-side API call
 */

import { apiClient } from '@/lib/api-client-instance';

export interface PDFGenerationOptions {
  includeCharts?: boolean;
  status?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown; // Allow additional parameters for filtering
}

/**
 * Generates a PDF report via server-side API
 */
export async function generatePDF(
  endpoint: string,
  options?: PDFGenerationOptions
): Promise<Blob> {
  // Make API call to server-side PDF generation endpoint
  const response = await apiClient.get<Blob>(endpoint, {
    params: options,
    responseType: 'blob',
  } as never);
  
  return response;
}
