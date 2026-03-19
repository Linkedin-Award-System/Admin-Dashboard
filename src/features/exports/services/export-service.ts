/**
 * Export Service
 * Handles client-side data export operations using generateCSV or generatePDF
 */

import { generateCSV } from '../utils/csv-generator';
import { generatePDF } from '../utils/pdf-generator';
import type { ExportFormat } from '../types';
import type { Category } from '@/features/categories/types';
import type { VoteStats } from '@/features/voting/types';
import type { PaymentTransaction } from '@/features/payments/types';
import type { Nominee } from '@/features/nominees/types';

export const exportService = {
  /**
   * Export categories as CSV or PDF
   */
  async exportCategories(format: ExportFormat, data: Category[]): Promise<Blob> {
    const rows = data.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      nomineeCount: c.nomineeCount,
    }));
    const headers = [
      { key: 'id' as const, label: 'ID' },
      { key: 'name' as const, label: 'Name' },
      { key: 'description' as const, label: 'Description' },
      { key: 'nomineeCount' as const, label: 'Nominee Count' },
    ];
    return format === 'pdf'
      ? generatePDF(rows, headers, 'Categories')
      : generateCSV(rows, headers);
  },

  /**
   * Export vote statistics as CSV or PDF
   */
  async exportVoteStats(format: ExportFormat, data: VoteStats[]): Promise<Blob> {
    const rows = data.map(stat => ({
      categoryName: stat.categoryName,
      leadingNominee: stat.leadingNominee.name,
      totalVotes: stat.totalVotes,
    }));

    const headers = [
      { key: 'categoryName' as const, label: 'Category Name' },
      { key: 'leadingNominee' as const, label: 'Leading Nominee' },
      { key: 'totalVotes' as const, label: 'Total Votes' },
    ];

    return format === 'pdf'
      ? generatePDF(rows, headers, 'Vote Statistics')
      : generateCSV(rows, headers);
  },

  /**
   * Export payment transactions as CSV or PDF
   */
  async exportPayments(format: ExportFormat, data: PaymentTransaction[]): Promise<Blob> {
    const rows = data.map(p => ({
      id: p.id,
      txRef: p.txRef,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt,
    }));
    const headers = [
      { key: 'id' as const, label: 'ID' },
      { key: 'txRef' as const, label: 'Tx Ref' },
      { key: 'amount' as const, label: 'Amount' },
      { key: 'currency' as const, label: 'Currency' },
      { key: 'status' as const, label: 'Status' },
      { key: 'createdAt' as const, label: 'Created At' },
    ];
    return format === 'pdf'
      ? generatePDF(rows, headers, 'Payment Transactions')
      : generateCSV(rows, headers);
  },

  /**
   * Export nominees as CSV or PDF
   */
  async exportNominees(format: ExportFormat, data: Nominee[]): Promise<Blob> {
    const rows = data.map(nominee => ({
      id: nominee.id,
      fullName: nominee.fullName,
      organization: nominee.organization,
      voteCount: nominee.voteCount,
      categories: nominee.categories.map(c => c.name).join(';'),
    }));

    const headers = [
      { key: 'id' as const, label: 'ID' },
      { key: 'fullName' as const, label: 'Full Name' },
      { key: 'organization' as const, label: 'Organization' },
      { key: 'voteCount' as const, label: 'Vote Count' },
      { key: 'categories' as const, label: 'Categories' },
    ];

    return format === 'pdf'
      ? generatePDF(rows, headers, 'Nominees')
      : generateCSV(rows, headers);
  },
};
