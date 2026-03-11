import { useMemo } from 'react';
import { usePayments } from '../hooks/use-payments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { PaymentListSkeleton } from './PaymentListSkeleton';
import type { PaymentFilters, PaymentTransaction } from '../types';

interface PaymentListProps {
  filters?: PaymentFilters;
}

const getStatusVariant = (status: PaymentTransaction['status']) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    case 'refunded':
      return 'info';
    default:
      return 'default';
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const PaymentList = ({ filters }: PaymentListProps) => {
  const { data: payments, isLoading, error } = usePayments(filters);

  // Sort payments in reverse chronological order
  const sortedPayments = useMemo(() => {
    if (!payments) return [];
    return [...payments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [payments]);

  if (isLoading) {
    return <PaymentListSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Payment Transactions</h2>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Payments</CardTitle>
            <CardDescription className="text-red-600">
              {error instanceof Error ? error.message : 'An error occurred while loading payment transactions'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Payment Transactions</h2>
        <ExportButton
          onExport={(format) => exportService.exportPayments(format, filters)}
          filename={`payments${filters?.status ? `-${filters.status}` : ''}${filters?.startDate ? `-${filters.startDate}-to-${filters.endDate}` : ''}`}
          label="Export Payments"
          aria-label="Export payment transactions to CSV or PDF"
          className="w-full sm:w-auto"
        />
      </div>

      {sortedPayments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Transactions Found</CardTitle>
            <CardDescription>
              {filters?.status || filters?.startDate || filters?.endDate
                ? 'No payment transactions match your filter criteria.'
                : 'No payment transactions available.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3" role="list" aria-label="Payment transactions">
          {sortedPayments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-md transition-shadow" role="listitem">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Transaction #{payment.transactionId}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <time dateTime={payment.createdAt}>
                        {formatDate(payment.createdAt)}
                      </time>
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={getStatusVariant(payment.status)}
                    aria-label={`Payment status: ${payment.status}`}
                  >
                    {payment.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-lg font-semibold" aria-label={`Amount: ${formatCurrency(payment.amount, payment.currency)}`}>
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payer</p>
                    <p className="text-sm font-medium">{payment.payerName}</p>
                    <p className="text-xs text-gray-500">{payment.payerEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
