import { memo } from 'react';
import { DollarSign } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartEmpty } from './ChartEmpty';
import type { RevenueTrendsChartProps } from '../types';
import { formatDate, formatCurrency } from '../utils/format-utils';

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
      <div style={{ color: '#34d399', fontSize: 15 }}>{formatCurrency(payload[0].value)}</div>
    </div>
  );
};

export const RevenueTrendsChart = memo(function RevenueTrendsChart({
  data, isLoading = false, error = null,
}: RevenueTrendsChartProps) {
  if (isLoading) return <ChartSkeleton height={280} />;
  if (error || !data?.length) return (
    <ChartContainer title="Revenue Trends" icon={DollarSign} chartHeight="240px">
      <ChartEmpty message="No revenue data available" icon={DollarSign} />
    </ChartContainer>
  );

  const chartData = data.map(d => ({ date: formatDate(d.date), revenue: d.revenue }));

  return (
    <ChartContainer title="Revenue Trends" icon={DollarSign} chartHeight="240px">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} dy={6} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v)} dx={-4} width={70} />
          <Tooltip content={<Tip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone" dataKey="revenue"
            stroke="#10b981" strokeWidth={2.5}
            fill="url(#revGrad)"
            activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});
