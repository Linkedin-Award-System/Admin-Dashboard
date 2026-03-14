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
      <div className="p-16 rounded-[2.5rem] border-2 border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50/30 backdrop-blur-sm text-center shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex p-5 bg-red-100 rounded-3xl mb-6 shadow-lg">
          <AlertCircle size={56} className="text-red-600" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-black text-red-900 tracking-tight">Payment Data Unavailable</h3>
        <p className="text-red-700 font-medium mt-3 max-w-md mx-auto leading-relaxed">
          {error instanceof Error ? error.message : 'An error occurred while loading payment transactions'}
        </p>
        <Button 
          variant="outline" 
          className="mt-8 border-2 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400 font-bold px-8 py-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5" 
          onClick={() => window.location.reload()}
        >
          <RotateCcw size={18} className="mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Enhanced Header with Total & Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-white via-blue-50/30 to-white p-8 rounded-[2.5rem] border-2 border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            <span className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white shadow-lg">
              <CreditCard size={32} strokeWidth={2.5} />
            </span>
            Transactions
          </h2>
          <div className="flex items-center gap-3 ml-1">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-gray-600 font-bold text-sm">
              Showing <span className="text-green-600 font-black">{sortedPayments.length}</span> of <span className="font-black">{payments?.length || 0}</span> recent transactions
            </p>
          </div>
        </div>
        
        <ExportButton
          onExport={(format) => exportService.exportPayments(format, filters)}
          filename={`payments${filters?.status ? `-${filters.status}` : ''}`}
          label="Export Ledger"
          className="rounded-2xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 font-bold h-14 px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        />
      </div>

      {sortedPayments.length === 0 ? (
        <div className="py-24 text-center bg-gradient-to-br from-white via-slate-50 to-white backdrop-blur-md rounded-[3rem] border-2 border-dashed border-gray-300 shadow-inner animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg mx-auto mb-6">
            <FileText className="text-gray-500" size={48} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-black text-gray-800 tracking-tight">No Records Found</h3>
          <p className="text-gray-600 font-medium mt-3 max-w-sm mx-auto leading-relaxed">
            Adjust your filters or try a different date range to view transactions.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" />
            <span className="font-semibold">Awaiting filter criteria</span>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedPayments.map((payment, index) => {
            const status = getStatusConfig(payment.status);
            const StatusIcon = status.icon;
            
            return (
              <div 
                key={payment.id} 
                className="group relative bg-white/90 backdrop-blur-sm p-7 rounded-[2rem] border-2 border-gray-200/60 shadow-lg hover:shadow-2xl hover:border-blue-300/50 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                  {/* Enhanced Status Indicator Area */}
                  <div className="flex items-center gap-4 xl:w-64 shrink-0">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                      payment.status === 'COMPLETED' ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white" :
                      payment.status === 'PENDING' ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white" :
                      payment.status === 'FAILED' ? "bg-gradient-to-br from-red-400 to-rose-500 text-white" :
                      "bg-gradient-to-br from-blue-400 to-indigo-500 text-white"
                    )}>
                      <StatusIcon size={26} strokeWidth={2.5} />
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

                  {/* Enhanced Amount / Action Area */}
                  <div className="xl:w-52 text-right shrink-0 flex items-center justify-between xl:justify-end gap-6 border-t-2 xl:border-t-0 xl:border-l-2 border-gray-200/60 pt-5 xl:pt-0 xl:pl-6">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Amount</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl hover:bg-blue-50 hover:text-blue-600 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm"
                    >
                      <FileText size={20} strokeWidth={2} />
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
