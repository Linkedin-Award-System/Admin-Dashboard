/**
 * Export Service
 * Handles data export operations for categories, vote stats, and payments
 * Uses server-side CSV export endpoints
 */

import type { ExportFormat } from '../types';
import type { PaymentFilters } from '@/features/payments/types';
import type { DateRange } from '@/features/voting/types';

export const exportService = {
  /**
   * Export categories - uses server CSV endpoint
   */
  async exportCategories(format: ExportFormat): Promise<Blob> {
    if (format === 'csv') {
      // Use server-side CSV export
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/categories/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to export categories');
      }
      
      return response.blob();
    } else {
      // PDF generation via server-side API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/categories/export?format=pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to export categories as PDF');
      }
      
      return response.blob();
    }
  },

  /**
   * Export vote statistics - uses server CSV endpoint
   */
  async exportVoteStats(format: ExportFormat, dateRange?: DateRange): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (dateRange) {
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
    }
    
    if (format === 'pdf') {
      params.append('format', 'pdf');
    }
    
    const queryString = params.toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/admin/votes/export${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export vote statistics');
    }
    
    return response.blob();
  },

  /**
   * Export payment transactions - uses server CSV endpoint
   */
  async exportPayments(format: ExportFormat, filters?: PaymentFilters): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }
    
    if (format === 'pdf') {
      params.append('format', 'pdf');
    }
    
    const queryString = params.toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/admin/payments/export${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export payments');
    }
    
    return response.blob();
  },
};
