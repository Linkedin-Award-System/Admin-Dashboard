import { useTotalRevenue, usePayments } from '../hooks/use-payments';
import { Landmark, TrendingUp, Clock, XCircle, RotateCcw } from 'lucide-react';
import { MetricCardSkeleton } from '@/features/dashboard/components/MetricCardSkeleton';
import { formatCompactCurrency, formatCurrency } from '@/features/dashboard/utils/format-utils';

export const RevenueCard = () => {
  const { data: totalRevenue, isLoading: revLoading, error: revError } = useTotalRevenue();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  const isLoading = revLoading || paymentsLoading;

  if (isLoading) return <MetricCardSkeleton />;

  if (revError) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 text-red-700 mb-2">
          <div className="p-2 bg-red-200/50 rounded-xl">
            <Landmark className="h-5 w-5" />
          </div>
          <p className="font-semibold text-sm">Error Loading Revenue</p>
        </div>
        <p className="text-xs text-red-600">Unable to retrieve revenue data.</p>
      </div>
    );
  }

  const completed = payments?.filter(p => p.status === 'COMPLETED') ?? [];
  const pending = payments?.filter(p => p.status === 'PENDING') ?? [];
  const failed = payments?.filter(p => p.status === 'FAILED') ?? [];
  const refunded = payments?.filter(p => p.status === 'REFUNDED') ?? [];

  const completedRevenue = completed.reduce((sum, p) => sum + p.amount, 0);
  const pendingRevenue = pending.reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { label: 'Settled', count: completed.length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Pending', count: pending.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Failed', count: failed.length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'Refunded', count: refunded.length, icon: RotateCcw, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  ];

  return (
    <div className="bg-white rounded-[1.75rem] border border-border-light shadow-sm overflow-hidden">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-[#085299] to-[#0a66c2] p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-100">Total Revenue</span>
        </div>
        <div className="text-3xl font-bold tracking-tight">
          {formatCompactCurrency(totalRevenue ?? 0)}
        </div>
        <div className="text-sm text-blue-200 mt-1 font-medium">
          {formatCurrency(totalRevenue ?? 0)} total collected
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="p-4 space-y-2 border-b border-border-light">
        <div className="flex items-center justify-between py-2 px-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <span className="text-xs font-semibold text-emerald-700">Settled Revenue</span>
          <span className="text-sm font-bold text-emerald-700">{formatCompactCurrency(completedRevenue)}</span>
        </div>
        <div className="flex items-center justify-between py-2 px-3 bg-amber-50 rounded-xl border border-amber-100">
          <span className="text-xs font-semibold text-amber-700">Pending Revenue</span>
          <span className="text-sm font-bold text-amber-700">{formatCompactCurrency(pendingRevenue)}</span>
        </div>
      </div>

      {/* Status breakdown grid */}
      <div className="p-4 grid grid-cols-2 gap-2">
        {stats.map(({ label, count, icon: Icon, color, bg, border }) => (
          <div key={label} className={`flex flex-col items-center justify-center p-3 rounded-xl ${bg} border ${border}`}>
            <Icon className={`h-4 w-4 ${color} mb-1`} />
            <span className={`text-lg font-bold ${color}`}>{count}</span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
