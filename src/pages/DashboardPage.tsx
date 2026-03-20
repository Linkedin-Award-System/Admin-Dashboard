import { Layout } from '@/shared/components/layout';
import { useAuthStore } from '@/features/auth';
import { TrendingUp, DollarSign, Users, FolderOpen, BarChart3, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { VotingTrendsChart } from '@/features/dashboard/components/VotingTrendsChart';
import { VotesByCategoryChart } from '@/features/dashboard/components/VotesByCategoryChart';
import { RevenueTrendsChart } from '@/features/dashboard/components/RevenueTrendsChart';
import { PaymentStatusChart } from '@/features/dashboard/components/PaymentStatusChart';
import { NomineesByCategoryChart } from '@/features/dashboard/components/NomineesByCategoryChart';
import { NomineeStatusChart } from '@/features/dashboard/components/NomineeStatusChart';
import {
  useDashboardMetrics, useVotingTrends, useVotesByCategory,
  useRevenueTrends, usePaymentStatus, useNomineesByCategory, useNomineeStatus,
} from '@/features/dashboard/hooks/use-dashboard-analytics';
import { formatNumber, formatCurrency } from '@/features/dashboard/utils/format-utils';

// ─── Metric Card ──────────────────────────────────────────────────────────────

const METRIC_DEFS = [
  { key: 'votes',      title: 'Verified Votes',       icon: TrendingUp, color: '#0a66c2', bg: 'rgba(10,102,194,0.08)'  },
  { key: 'revenue',    title: 'Gross Revenue',         icon: DollarSign, color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
  { key: 'nominees',   title: 'Platform Nominees',     icon: Users,      color: '#a855f7', bg: 'rgba(168,85,247,0.08)'  },
  { key: 'categories', title: 'Designated Categories', icon: FolderOpen, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
] as const;

function MetricCard({
  title, value, Icon, color, bg, trend,
}: {
  title: string; value: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string; bg: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 14,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.18s, transform 0.18s',
        cursor: 'default',
        flex: '1 1 0',
        minWidth: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 24px ${color}22`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Decorative corner circle */}
      <div style={{
        position: 'absolute', top: -24, right: -24,
        width: 80, height: 80, borderRadius: '50%',
        background: color, opacity: 0.07, pointerEvents: 'none',
      }} />

      {/* Trend badge — anchored to the center of the corner circle (top:-24+40=16, right:-24+40=16) */}
      {trend && (
        <span style={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '3px 7px', borderRadius: 20,
          background: trend.isPositive ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${trend.isPositive ? '#bbf7d0' : '#fecaca'}`,
          color: trend.isPositive ? '#16a34a' : '#dc2626',
          fontSize: 10, fontWeight: 600,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          zIndex: 1,
        }}>
          {trend.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend.value > 0 ? `+${trend.value.toFixed(1)}%` : `${trend.value.toFixed(1)}%`}
        </span>
      )}

      {/* Top row: icon only */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} color={color} />
        </div>
      </div>

      {/* Value + label */}
      <div>
        <div style={{ fontSize: 24, fontWeight: 500, color: '#111827', letterSpacing: '-0.01em', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.09em', marginTop: 5 }}>
          {title}
        </div>
      </div>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14,
      padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14,
      flex: '1 1 0', minWidth: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f3f4f6' }} />
        <div style={{ width: 52, height: 22, borderRadius: 20, background: '#f3f4f6' }} />
      </div>
      <div>
        <div style={{ width: 90, height: 22, borderRadius: 5, background: '#f3f4f6', marginBottom: 7 }} />
        <div style={{ width: 110, height: 11, borderRadius: 4, background: '#f3f4f6' }} />
      </div>
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; color?: string }>; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6,
        background: '#0a66c2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={13} color="#fff" />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', letterSpacing: '0.01em' }}>{label}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: metrics, isLoading } = useDashboardMetrics();

  const { data: votingTrends,       isLoading: lTrends,   error: eTrends   } = useVotingTrends();
  const { data: votesByCategory,    isLoading: lByCat,    error: eByCat    } = useVotesByCategory();
  const { data: revenueTrends,      isLoading: lRevenue,  error: eRevenue  } = useRevenueTrends();
  const { data: paymentStatus,      isLoading: lPayments, error: ePayments } = usePaymentStatus();
  const { data: nomineesByCategory, isLoading: lNomByCat, error: eNomByCat } = useNomineesByCategory();
  const { data: nomineeStatus,      isLoading: lNomStat,  error: eNomStat  } = useNomineeStatus();

  const metricValues = metrics ? [
    formatNumber(metrics.totalVotes),
    formatCurrency(metrics.totalRevenue),
    formatNumber(metrics.totalNominees),
    formatNumber(metrics.totalCategories),
  ] : ['—', '—', '—', '—'];

  const metricTrends = metrics?.trends
    ? [metrics.trends.votes, metrics.trends.revenue, metrics.trends.nominees, metrics.trends.categories]
    : [undefined, undefined, undefined, undefined];

  return (
    <Layout>
      <div style={{ maxWidth: 1560, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
            <h1 style={{ fontSize: 22, fontWeight: 400, color: '#111827', letterSpacing: '-0.01em', margin: 0 }}>
              Executive Overview
            </h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 9px', borderRadius: 20,
              background: '#f0fdf4', color: '#16a34a',
              fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Live
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, fontWeight: 400 }}>
            Welcome to the command center, {user?.name || 'Admin'}
          </p>
        </div>

        {/* ── Metric Cards — fixed 4-column row ── */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
          {isLoading
            ? Array(4).fill(0).map((_, i) => <MetricSkeleton key={i} />)
            : METRIC_DEFS.map((def, i) => (
                <MetricCard
                  key={def.key}
                  title={def.title}
                  value={metricValues[i]}
                  Icon={def.icon}
                  color={def.color}
                  bg={def.bg}
                  trend={metricTrends[i]}
                />
              ))
          }
        </div>

        {/* ── Main analytics: left 2/3 + right 1/3 ── */}
        <div style={{ display: 'grid', gap: 20 }} className="db-outer-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="db-left-col">

            {/* Voting Intelligence */}
            <div>
              <SectionLabel icon={BarChart3} label="Voting Intelligence" />
              <div style={{ display: 'grid', gap: 14 }} className="db-chart-pair">
                <VotingTrendsChart    data={votingTrends    ?? []} isLoading={lTrends}  error={eTrends}  />
                <VotesByCategoryChart data={votesByCategory ?? []} isLoading={lByCat}   error={eByCat}   />
              </div>
            </div>

            {/* Revenue Stream */}
            <div>
              <SectionLabel icon={DollarSign} label="Revenue Stream" />
              <div style={{ display: 'grid', gap: 14 }} className="db-chart-pair">
                <RevenueTrendsChart data={revenueTrends  ?? []} isLoading={lRevenue}  error={eRevenue}  />
                <PaymentStatusChart data={paymentStatus  ?? []} isLoading={lPayments} error={ePayments} />
              </div>
            </div>
          </div>

          {/* Right column — Nominee Pulse */}
          <div className="db-right-col">
            <SectionLabel icon={Activity} label="Nominee Pulse" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <NomineesByCategoryChart data={nomineesByCategory ?? []} isLoading={lNomByCat} error={eNomByCat} />
              <NomineeStatusChart      data={nomineeStatus      ?? []} isLoading={lNomStat}  error={eNomStat}  />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Outer 2-col grid: left takes 2fr, right 1fr */
        .db-outer-grid {
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          grid-template-rows: auto;
        }
        .db-left-col  { grid-column: 1; }
        .db-right-col { grid-column: 2; }

        /* Each chart pair: two equal columns */
        .db-chart-pair {
          grid-template-columns: 1fr 1fr;
        }

        /* Tablet: stack right col below */
        @media (max-width: 1100px) {
          .db-outer-grid {
            grid-template-columns: 1fr !important;
          }
          .db-left-col, .db-right-col {
            grid-column: 1 !important;
          }
        }

        /* Mobile: stack chart pairs too */
        @media (max-width: 700px) {
          .db-chart-pair {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}

export default DashboardPage;
