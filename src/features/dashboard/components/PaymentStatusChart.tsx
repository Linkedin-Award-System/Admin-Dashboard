import { memo } from 'react';
import { CreditCard } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartError } from './ChartError';
import { ChartEmpty } from './ChartEmpty';
import type { PaymentStatusChartProps } from '../types';
import {
  chartMargins,
  chartDimensions,
} from '../utils/chart-config';
import { formatNumber } from '../utils/format-utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-secondary/90 backdrop-blur-md border border-border-light p-4 rounded-2xl shadow-xl space-y-2 ring-1 ring-black/5">
        <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-3">
          <div 
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]" 
            style={{ backgroundColor: payload[0].payload.fill }} 
          />
          <p className="text-lg font-bold text-text-primary">
            {formatNumber(payload[0].value)} <span className="text-sm font-normal text-text-secondary ml-1">Payments</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * PaymentStatusChart Component
 */
export const PaymentStatusChart = memo(function PaymentStatusChart({ 
  data, 
  isLoading = false, 
  error = null 
}: PaymentStatusChartProps) {
  if (isLoading) {
    return <ChartSkeleton height={chartDimensions.height.small} />;
  }

  if (error) {
    return <ChartError error={error} onRetry={() => window.location.reload()} />;
  }

  if (!data || data.length === 0) {
    return <ChartEmpty message="No payment data available" icon={CreditCard} />;
  }

  const COLORS: Record<string, string> = {
    successful: '#10b981',
    pending: '#f59e0b',
    failed: '#ef4444',
  };

  const chartData = data.map(item => ({
    ...item,
    fill: COLORS[item.status.toLowerCase()] || '#6b7280',
  }));

  return (
    <ChartContainer title="Payment Status" icon={CreditCard}>
      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <BarChart
            data={chartData}
            margin={chartMargins.withAxis}
            layout="vertical"
            barSize={32}
          >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--border-light)"
            horizontal={false}
          />

          <XAxis
            type="number"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatNumber(value)}
          />

          <YAxis
            type="category"
            dataKey="status"
            tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--primary-500)', opacity: 0.05 }} />

          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
});
