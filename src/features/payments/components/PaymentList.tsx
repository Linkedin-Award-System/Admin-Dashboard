import { useMemo } from 'react';
import { usePayments } from '../hooks/use-payments';
import { StatusBadge } from '@/shared/design-system/patterns/StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { PaymentListSkeleton } from './PaymentListSkeleton';
import type { PaymentFilters, PaymentTransaction } from '../types';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  FileText,
  Building2,
  Calendar,
  Hash
} from 'lucide-react';
import { formatCurrency } from '@/features/dashboard/utils/format-utils';

interface PaymentListProps {
  filters?: PaymentFilters;
}

const getStatusConfig = (status: PaymentTransaction['status']) => {
  switch (status) {
    case 'COMPLETED':
      return { status: 'completed' as const, icon: CheckCircle2, label: 'Completed' };
    case 'PENDING':
      return { status: 'pending' as const, icon: Clock, label: 'Pending' };
    case 'FAILED':
      return { status: 'failed' as const, icon: AlertCircle, label: 'Failed' };
    case 'REFUNDED':
      return { status: 'refunded' as const, icon: RotateCcw, label: 'Refunded' };
    default:
      return { status: 'inactive' as const, icon: CreditCard, label: status };
  }
};

const formatDatePremium = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const PaymentList = ({ filters }: PaymentListProps) => {
  const { data: payments, isLoading, error } = usePayments(filters);

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
      <div className="p-12 rounded-[2rem] border border-red-100 bg-red-50/50 backdrop-blur-sm text-center">
        <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
        <h3 className="text-xl font-bold text-red-800">Payment Data Unavailable</h3>
        <p className="text-red-600 mt-2 max-w-md mx-auto">
          {error instanceof Error ? error.message : 'An error occurred while loading payment transactions'}
        </p>
        <Button variant="outline" className="mt-6 border-red-200 text-red-700 hover:bg-red-100" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Total & Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-border-light shadow-premium">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-green-50 rounded-2xl text-green-600">
              <CreditCard size={28} />
            </span>
            Transactions
          </h2>
          <p className="text-text-tertiary mt-1 font-medium italic">
            Showing {sortedPayments.length} of {payments?.length || 0} recent transactions
          </p>
        </div>
        
        <ExportButton
          onExport={(format) => exportService.exportPayments(format, filters)}
          filename={`payments${filters?.status ? `-${filters.status}` : ''}`}
          label="Export Ledger"
          className="rounded-2xl border-border-light hover:bg-bg-tertiary font-bold h-12 px-6"
        />
      </div>

      {sortedPayments.length === 0 ? (
        <div className="py-20 text-center bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-border-light border-dashed">
          <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-text-tertiary" size={40} />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No Records Found</h3>
          <p className="text-text-tertiary mt-2">
            Adjust your filters or try a different date range.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedPayments.map((payment, index) => {
            const status = getStatusConfig(payment.status);
            const StatusIcon = status.icon;
            
            return (
              <div 
                key={payment.id} 
                className="group relative bg-white p-6 rounded-[1.5rem] border border-border-light shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                  {/* Status Indicator Area */}
                  <div className="flex items-center gap-4 xl:w-64 shrink-0">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110",
                      payment.status === 'COMPLETED' ? "bg-green-50 text-green-600" :
                      payment.status === 'PENDING' ? "bg-orange-50 text-orange-600" :
                      payment.status === 'FAILED' ? "bg-red-50 text-red-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      <StatusIcon size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={status.status} size="sm" />
                        {payment.status === 'COMPLETED' && <CheckCircle2 size={14} className="text-green-500" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-text-tertiary text-xs font-bold mt-1.5">
                        <Clock size={12} />
                        {formatDatePremium(payment.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Transaction ID & Meta */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                        <Hash size={10} /> Reference ID
                      </Label>
                      <p className="text-sm font-mono font-bold text-text-secondary select-all truncate">
                        {payment.txRef}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-black text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 size={10} /> Allocation
                      </Label>
                      <p className="text-sm font-bold text-text-secondary">
                        Package ID: {payment.packageId}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-black text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar size={10} /> Settlement
                      </Label>
                      <p className="text-sm font-bold text-text-secondary">
                        {payment.completedAt ? formatDatePremium(payment.completedAt) : '--'}
                      </p>
                    </div>
                  </div>

                  {/* Amount / Action Area */}
                  <div className="xl:w-48 text-right shrink-0 flex items-center justify-between xl:justify-end gap-6 border-t xl:border-t-0 pt-4 xl:pt-0">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-black text-text-tertiary uppercase tracking-wider">Amount</div>
                      <div className="text-2xl font-black text-text-primary tracking-tight">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl hover:bg-bg-tertiary text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FileText size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
