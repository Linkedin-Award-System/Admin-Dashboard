import { memo } from 'react';
import { CreditCard } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartEmpty } from './ChartEmpty';
import type { PaymentStatusChartProps } from '../types';
import { formatNumber } from '../utils/format-utils';

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#10b981',
  PENDING:   '#f59e0b',
  FAILED:    '#ef4444',
  REFUNDED:  '#6b7280',
};

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e293b', color: '#f1f5f9',
      padding: '10px 14px', borderRadius: 10,
      fontSize: 12, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ color: '#94a3b8', marginBottom: 4, fontSize: 11 }}>{label}</div>
      <div style={{ color: '#fff', fontSize: 15 }}>{formatNumber(payload[0].value)} payments</div>
    </div>
  );
};

export const PaymentStatusChart = memo(function PaymentStatusChart({
  data, isLoading = false, error = null,
}: PaymentStatusChartProps) {
  if (isLoading) return <ChartSkeleton height={200} />;
  if (error || !data?.length) return (
    <ChartContainer title="Payment Status" icon={CreditCard} chartHeight="240px">
      <ChartEmpty message="No payment data available" icon={CreditCard} />
    </ChartContainer>
  );

  return (
    <ChartContainer title="Payment Status" icon={CreditCard} chartHeight="240px">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
          <YAxis type="category" dataKey="status" tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={STATUS_COLORS[entry.status] ?? '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});
