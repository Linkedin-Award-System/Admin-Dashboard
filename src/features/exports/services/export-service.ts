/**
 * Export Service
 * Handles data export operations for categories, vote stats, and payments
 */

import { apiClient } from '@/lib/api-client-instance';
import { generateCSV } from '../utils/csv-generator';
import { generatePDF, type PDFGenerationOptions } from '../utils/pdf-generator';
import type { ExportFormat } from '../types';
import type { Category } from '@/features/categories/types';
import type { VoteStats } from '@/features/voting/types';
import type { PaymentTransaction, PaymentFilters } from '@/features/payments/types';
import type { DateRange } from '@/features/voting/types';

export const exportService = {
  /**
   * Export categories with their nominees
   */
  async exportCategories(format: ExportFormat): Promise<Blob> {
    if (format === 'csv') {
      // Fetch categories data
      const categories = await apiClient.get<Category[]>('/categories');
      
      // Define CSV headers
      const headers = [
        { key: 'id' as keyof Category, label: 'ID' },
        { key: 'name' as keyof Category, label: 'Name' },
        { key: 'description' as keyof Category, label: 'Description' },
        { key: 'nomineeCount' as keyof Category, label: 'Nominee Count' },
        { key: 'createdAt' as keyof Category, label: 'Created At' },
        { key: 'updatedAt' as keyof Category, label: 'Updated At' },
      ];
      
      return generateCSV(categories as unknown as Record<string, unknown>[], headers);
    } else {
      // PDF generation via server-side API
      return generatePDF('/exports/categories/pdf');
    }
  },

  /**
   * Export vote statistics
   */
  async exportVoteStats(format: ExportFormat, dateRange?: DateRange): Promise<Blob> {
    if (format === 'csv') {
      // Fetch vote stats data
      const params = dateRange ? { 
        startDate: dateRange.startDate, 
        endDate: dateRange.endDate 
      } : undefined;
      
      const voteStats = await apiClient.get<VoteStats[]>('/voting/stats', { params });
      
      // Flatten the data for CSV export
      const flattenedData = voteStats.flatMap(category => 
        category.nominees.map(nominee => ({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          categoryTotalVotes: category.totalVotes,
          nomineeId: nominee.nomineeId,
          nomineeName: nominee.nomineeName,
          nomineeVoteCount: nominee.voteCount,
          nomineePercentage: nominee.percentage,
          isLeading: category.leadingNominee.id === nominee.nomineeId,
        }))
      );
      
      // Define CSV headers
      const headers = [
        { key: 'categoryId' as const, label: 'Category ID' },
        { key: 'categoryName' as const, label: 'Category Name' },
        { key: 'categoryTotalVotes' as const, label: 'Category Total Votes' },
        { key: 'nomineeId' as const, label: 'Nominee ID' },
        { key: 'nomineeName' as const, label: 'Nominee Name' },
        { key: 'nomineeVoteCount' as const, label: 'Nominee Vote Count' },
        { key: 'nomineePercentage' as const, label: 'Nominee Percentage' },
        { key: 'isLeading' as const, label: 'Is Leading' },
      ];
      
      return generateCSV(flattenedData, headers);
    } else {
      // PDF generation via server-side API
      const params = dateRange ? { 
        startDate: dateRange.startDate, 
        endDate: dateRange.endDate,
        includeCharts: true,
      } : { includeCharts: true };
      
      return generatePDF('/exports/vote-stats/pdf', params);
    }
  },

  /**
   * Export payment transactions
   */
  async exportPayments(format: ExportFormat, filters?: PaymentFilters): Promise<Blob> {
    if (format === 'csv') {
      // Fetch payment transactions
      const params = filters ? {
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
      } : undefined;
      
      const payments = await apiClient.get<PaymentTransaction[]>('/payments', { params });
      
      // Define CSV headers
      const headers = [
        { key: 'id' as keyof PaymentTransaction, label: 'ID' },
        { key: 'transactionId' as keyof PaymentTransaction, label: 'Transaction ID' },
        { key: 'amount' as keyof PaymentTransaction, label: 'Amount' },
        { key: 'currency' as keyof PaymentTransaction, label: 'Currency' },
        { key: 'status' as keyof PaymentTransaction, label: 'Status' },
        { key: 'payerName' as keyof PaymentTransaction, label: 'Payer Name' },
        { key: 'payerEmail' as keyof PaymentTransaction, label: 'Payer Email' },
        { key: 'createdAt' as keyof PaymentTransaction, label: 'Created At' },
        { key: 'updatedAt' as keyof PaymentTransaction, label: 'Updated At' },
      ];
      
      return generateCSV(payments as unknown as Record<string, unknown>[], headers);
    } else {
      // PDF generation via server-side API
      const params: PDFGenerationOptions | undefined = filters ? {
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
      } : undefined;
      
      return generatePDF('/exports/payments/pdf', params);
    }
  },
};
