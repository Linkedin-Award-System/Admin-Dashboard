import { useTotalRevenue, usePayments } from '../hooks/use-payments';
import { Landmark, TrendingUp } from 'lucide-react';
import { MetricCardSkeleton } from '@/features/dashboard/components/MetricCardSkeleton';
import { formatCurrency } from '@/features/dashboard/utils/format-utils';

function safeFormatRevenue(value: number): string {
  if (!isFinite(value) || value > 1e12) return 'ETB 0.00';
  return formatCurrency(value);
}

function safeCompact(value: number): string {
  if (!isFinite(value) || value > 1e12) return 'ETB 0';
  if (value >= 1_000_000_000) return `ETB ${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `ETB ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `ETB ${(value / 1_000).toFixed(1)}K`;
  return `ETB ${value.toFixed(2)}`;
}

const STATUS_ROWS = [
  { key: 'COMPLETED', label: 'Settled',  dot: '#10b981' },
  { key: 'PENDING',   label: 'Pending',  dot: '#f59e0b' },
  { key: 'FAILED',    label: 'Failed',   dot: '#ef4444' },
  { key: 'REFUNDED',  label: 'Refunded', dot: '#6366f1' },
] as const;

export const RevenueCard = () => {
  const { data: totalRevenue, isLoading: revLoading, error: revError } = useTotalRevenue();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  const isLoading = revLoading || paymentsLoading;

  if (isLoading) return <MetricCardSkeleton />;

  if (revError) {
    return (
      <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#dc2626' }}>
          <Landmark size={18} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Error loading revenue</span>
        </div>
      </div>
    );
  }

  const byStatus = (s: string) => payments?.filter(p => p.status === s) ?? [];
  const completed = byStatus('COMPLETED');
  const pending   = byStatus('PENDING');
  const failed    = byStatus('FAILED');
  const refunded  = byStatus('REFUNDED');

  const completedRevenue = completed.reduce((s, p) => s + (p.amount ?? 0), 0);
  const pendingRevenue   = pending.reduce((s, p) => s + (p.amount ?? 0), 0);

  const counts: Record<string, number> = {
    COMPLETED: completed.length,
    PENDING:   pending.length,
    FAILED:    failed.length,
    REFUNDED:  refunded.length,
  };

  const total = totalRevenue ?? 0;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '1.5rem',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      overflow: 'hidden',
    }}>
      {/* Gradient header */}
      <div style={{
        background: 'linear-gradient(135deg, #064e8c 0%, #0a66c2 60%, #1d7fd4 100%)',
        padding: '1.5rem 1.5rem 1.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Total Revenue
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '4px 10px' }}>
            <TrendingUp size={11} color="rgba(255,255,255,0.9)" />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em' }}>LIVE</span>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>
            {safeCompact(total)}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.01em' }}>
            {safeFormatRevenue(total)} total collected
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #d1fae5' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#065f46' }}>Settled Revenue</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>{safeFormatRevenue(completedRevenue)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1rem', background: '#fffbeb', borderRadius: '0.75rem', border: '1px solid #fde68a' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#92400e' }}>Pending Revenue</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#d97706' }}>{safeFormatRevenue(pendingRevenue)}</span>
        </div>
      </div>

      {/* Status count rows */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {STATUS_ROWS.map(({ key, label, dot }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', borderRadius: '0.625rem', background: '#f9fafb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{counts[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
