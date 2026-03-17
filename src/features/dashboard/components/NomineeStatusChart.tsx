import { memo } from 'react';
import { CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartEmpty } from './ChartEmpty';
import type { NomineeStatusChartProps } from '../types';
import { formatNumber } from '../utils/format-utils';

// Match case-insensitively
function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('active') && s.includes('vote')) return '#0a66c2';
  if (s.includes('inactive') || s.includes('no vote')) return '#e5e7eb';
  return '#6b7280';
}

const Tip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: '#1e293b', color: '#f1f5f9',
      padding: '9px 13px', borderRadius: 9,
      fontSize: 12, fontWeight: 600,
      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ color: '#94a3b8', marginBottom: 3, fontSize: 11 }}>{d.name}</div>
      <div style={{ color: '#fff', fontSize: 14 }}>{formatNumber(d.value)}</div>
      <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 2 }}>{d.payload.percentage.toFixed(1)}%</div>
    </div>
  );
};

export const NomineeStatusChart = memo(function NomineeStatusChart({
  data, isLoading = false, error = null,
}: NomineeStatusChartProps) {
  if (isLoading) return <ChartSkeleton height={220} />;
  if (error || !data?.length) return (
    <ChartContainer title="Nominee Status" icon={CheckCircle} chartHeight="220px">
      <ChartEmpty message="No nominee status data" icon={CheckCircle} />
    </ChartContainer>
  );

  const chartData = data.map(d => ({
    name: d.status,
    value: d.count,
    percentage: d.percentage,
    fill: getStatusColor(d.status),
  }));

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <ChartContainer title="Nominee Status" icon={CheckCircle} chartHeight="220px">
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Pie */}
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius="52%" outerRadius="75%"
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#111827', lineHeight: 1 }}>{formatNumber(total)}</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>Total</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingTop: 8, flexShrink: 0 }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.fill, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>{d.name}</span>
              <span style={{ fontSize: 10, color: '#9ca3af' }}>{d.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
});
