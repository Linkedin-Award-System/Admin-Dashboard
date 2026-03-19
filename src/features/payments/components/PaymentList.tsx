import { useMemo, useState } from 'react';
import { usePayments, useUserEmailMap } from '../hooks/use-payments';
import { StatusBadge } from '@/shared/design-system/patterns/StatusBadge';
import { Button } from '@/shared/design-system';
import { Label } from '@/shared/components/ui/label';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { PaymentListSkeleton } from './PaymentListSkeleton';
import type { PaymentFilters, PaymentTransaction } from '../types';
import { cn } from '@/lib/utils';
import {
  CreditCard, Clock, CheckCircle2, AlertCircle, RotateCcw,
  FileText, Building2, Calendar, Hash, User, TrendingUp, AlertTriangle,
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/features/dashboard/utils/format-utils';

interface PaymentListProps {
  filters?: PaymentFilters;
  searchQuery?: string;
}

const STATUS_CONFIG: Record<string, {
  badge: 'completed' | 'pending' | 'failed' | 'refunded' | 'inactive';
  icon: React.ElementType;
  label: string;
  iconBg: string;
  rowAccent: string;
  amountColor: string;
}> = {
  COMPLETED: {
    badge: 'completed',
    icon: CheckCircle2,
    label: 'Completed',
    iconBg: 'linear-gradient(135deg, #34d399, #10b981)',
    rowAccent: 'border-l-emerald-400',
    amountColor: 'text-emerald-700',
  },
  PENDING: {
    badge: 'pending',
    icon: Clock,
    label: 'Pending',
    iconBg: 'linear-gradient(135deg, #fbbf24, #f97316)',
    rowAccent: 'border-l-amber-400',
    amountColor: 'text-amber-700',
  },
  FAILED: {
    badge: 'failed',
    icon: AlertCircle,
    label: 'Failed',
    iconBg: 'linear-gradient(135deg, #f87171, #e11d48)',
    rowAccent: 'border-l-red-400',
    amountColor: 'text-red-600',
  },
  REFUNDED: {
    badge: 'refunded',
    icon: RotateCcw,
    label: 'Refunded',
    iconBg: 'linear-gradient(135deg, #60a5fa, #6366f1)',
    rowAccent: 'border-l-blue-400',
    amountColor: 'text-blue-700',
  },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? {
    badge: 'inactive' as const,
    icon: CreditCard,
    label: status,
    iconBg: 'linear-gradient(135deg, #0a66c2, #1d8fe8)',
    rowAccent: 'border-l-blue-300',
    amountColor: 'text-blue-700',
  };

const QUICK_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Refunded', value: 'REFUNDED' },
];

export const PaymentList = ({ filters, searchQuery = '' }: PaymentListProps) => {
  const { data: payments, isLoading, error } = usePayments(filters);
  const userEmailMap = useUserEmailMap();
  const [currentPage, setCurrentPage] = useState(1);
  const [quickFilter, setQuickFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 15;

  const processedPayments = useMemo(() => {
    if (!payments) return [];
    let list = [...payments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (quickFilter) list = list.filter(p => p.status === quickFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        p =>
          p.txRef.toLowerCase().includes(q) ||
          p.userId.toLowerCase().includes(q) ||
          (userEmailMap[p.userId] ?? '').toLowerCase().includes(q) ||
          p.packageId.toLowerCase().includes(q)
      );
    }
    return list;
  }, [payments, quickFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(processedPayments.length / ITEMS_PER_PAGE));
  const paginatedPayments = processedPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Summary counts
  const counts = useMemo(() => {
    if (!payments) return { total: 0, completed: 0, pending: 0, failed: 0, refunded: 0 };
    return {
      total: payments.length,
      completed: payments.filter(p => p.status === 'COMPLETED').length,
      pending: payments.filter(p => p.status === 'PENDING').length,
      failed: payments.filter(p => p.status === 'FAILED').length,
      refunded: payments.filter(p => p.status === 'REFUNDED').length,
    };
  }, [payments]);

  const handleQuickFilter = (val: string) => {
    setQuickFilter(val);
    setCurrentPage(1);
  };

  if (isLoading) return <PaymentListSkeleton />;

  if (error) {
    return (
      <div className="p-16 rounded-[2.5rem] border border-red-200 bg-red-50/50 text-center">
        <div className="inline-flex p-4 bg-red-100 rounded-2xl mb-4">
          <AlertTriangle size={40} className="text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-800">Payment Data Unavailable</h3>
        <p className="text-red-600 mt-2 max-w-sm mx-auto text-sm">
          {error instanceof Error ? error.message : 'An error occurred while loading transactions'}
        </p>
        <Button variant="secondary" className="mt-6 rounded-xl border-red-200 text-red-700" onClick={() => window.location.reload()}>
          <RotateCcw size={16} className="mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Transactions header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[1.75rem] border border-border-light shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl text-white shadow-md" style={{ background: 'linear-gradient(135deg, #0a66c2, #1d8fe8)' }}>
            <CreditCard size={24} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{processedPayments.length}</span> of{' '}
                <span className="font-semibold">{counts.total}</span> transactions
              </p>
            </div>
          </div>
        </div>
        <ExportButton
          onExport={(format) => exportService.exportPayments(format, processedPayments)}
          filename={`payments${filters?.status ? `-${filters.status}` : ''}`}
          label="Export Ledger"
          className="rounded-xl border-border-light hover:bg-bg-tertiary h-11 px-5 font-semibold"
        />
      </div>

      {/* Summary stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Completed', count: counts.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Pending', count: counts.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Failed', count: counts.failed, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
          { label: 'Refunded', count: counts.refunded, icon: RotateCcw, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map(({ label, count, icon: Icon, color, bg, border }) => (
          <button
            key={label}
            onClick={() => handleQuickFilter(quickFilter === label.toUpperCase() ? '' : label.toUpperCase())}
            className={cn(
              'flex items-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-sm',
              quickFilter === label.toUpperCase()
                ? 'bg-[#0a66c2] border-[#0a66c2] shadow-md'
                : cn(bg, border, 'hover:shadow-sm')
            )}
          >
            <Icon className={cn('h-5 w-5 shrink-0', quickFilter === label.toUpperCase() ? 'text-white' : color)} />
            <div className="text-left">
              <div className={cn('text-xl font-bold', quickFilter === label.toUpperCase() ? 'text-white' : color)}>{count}</div>
              <div className={cn('text-[10px] font-semibold uppercase tracking-wide', quickFilter === label.toUpperCase() ? 'text-blue-100' : 'text-gray-500')}>{label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <TrendingUp size={14} className="text-text-tertiary shrink-0" />
        {QUICK_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => handleQuickFilter(f.value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold transition-all border',
              quickFilter === f.value
                ? 'text-white border-[#0a66c2] shadow-sm'
                : 'bg-white text-gray-600 border-border-light hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
            )}
            style={quickFilter === f.value ? { backgroundColor: '#0a66c2' } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      {processedPayments.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-border-light">
          <div className="inline-flex p-5 bg-gray-100 rounded-2xl mb-4">
            <FileText className="text-gray-400" size={40} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No Transactions Found</h3>
          <p className="text-gray-500 mt-2 text-sm">Adjust your filters to view transactions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedPayments.map((payment: PaymentTransaction, index: number) => {
            const cfg = getStatusConfig(payment.status);
            const StatusIcon = cfg.icon;
            const isExpanded = expandedId === payment.id;

            return (
              <div
                key={payment.id}
                className={cn(
                  'group bg-white rounded-[1.5rem] border border-border-light border-l-4 shadow-sm hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 overflow-hidden',
                  cfg.rowAccent
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Main row */}
                <div
                  className="flex flex-col lg:flex-row lg:items-center gap-4 p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : payment.id)}
                >
                  {/* Status icon + badge + date */}
                  <div className="flex items-center gap-3 lg:w-56 shrink-0">
                    <div
                      className="h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{ background: cfg.iconBg }}
                    >
                      <StatusIcon size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <StatusBadge status={cfg.badge} size="sm" />
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                        <Clock size={10} />
                        <span>{formatRelativeTime(payment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tx Ref */}
                  <div className="flex-1 min-w-0">
                    <Label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <Hash size={9} /> Reference
                    </Label>
                    <p className="text-sm font-mono font-semibold text-gray-800 truncate select-all">
                      {payment.txRef}
                    </p>
                  </div>

                  {/* User */}
                  <div className="hidden md:block w-36 shrink-0">
                    <Label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <User size={9} /> User
                    </Label>
                    <p className="text-sm font-medium text-gray-700 truncate">{(userEmailMap[payment.userId] ?? payment.userId) || '—'}</p>
                  </div>

                  {/* Date */}
                  <div className="hidden lg:block w-36 shrink-0">
                    <Label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <Calendar size={9} /> Date
                    </Label>
                    <p className="text-xs font-medium text-gray-600">{formatDateTime(payment.createdAt)}</p>
                  </div>

                  {/* Amount */}
                  <div className="lg:w-40 shrink-0 text-right">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Amount</div>
                    <div className={cn('text-xl font-bold', cfg.amountColor)}>
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-border-light/60 bg-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div>
                        <Label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <Hash size={9} /> Transaction ID
                        </Label>
                        <p className="text-xs font-mono text-gray-700 break-all">{payment.id}</p>
                      </div>
                      <div>
                        <Label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <Building2 size={9} /> Package ID
                        </Label>
                        <p className="text-xs font-medium text-gray-700">{payment.packageId || '—'}</p>
                      </div>
                      <div>
                        <Label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <Calendar size={9} /> Settlement Date
                        </Label>
                        <p className="text-xs font-medium text-gray-700">
                          {payment.completedAt ? formatDateTime(payment.completedAt) : '—'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <User size={9} /> User ID
                        </Label>
                        <p className="text-xs font-mono text-gray-700 break-all">{payment.userId || '—'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border-light">
          <p className="text-sm text-text-tertiary font-medium">
            Page {currentPage} of {totalPages} &middot; {processedPayments.length} transactions
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl h-10 px-4"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`e-${idx}`} className="px-2 text-text-tertiary text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={cn(
                      'h-10 w-10 rounded-xl text-sm font-semibold transition-all',
                      currentPage === p
                        ? 'text-white shadow-md scale-105'
                        : 'bg-white border border-border-light text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                    )}
                    style={currentPage === p ? { backgroundColor: '#0a66c2', borderColor: '#0a66c2' } : {}}
                  >
                    {p}
                  </button>
                )
              )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl h-10 px-4"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
