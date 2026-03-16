import { memo } from 'react';
import { DollarSign } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartError } from './ChartError';
import { ChartEmpty } from './ChartEmpty';
import type { RevenueTrendsChartProps } from '../types';
import {
  chartMargins,
  chartDimensions,
} from '../utils/chart-config';
import { formatDate, formatCurrency } from '../utils/format-utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-secondary/90 backdrop-blur-md border border-border-light p-4 rounded-2xl shadow-xl space-y-2 ring-1 ring-black/5">
        <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(payload[0].value)} <span className="text-sm font-normal text-text-secondary ml-1">ETB</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * RevenueTrendsChart Component
 */
export const RevenueTrendsChart = memo(function RevenueTrendsChart({ 
  data, 
  isLoading = false, 
  error = null 
}: RevenueTrendsChartProps) {
  if (isLoading) {
    return <ChartSkeleton height={chartDimensions.height.medium} />;
  }

  if (error) {
    return <ChartError error={error} onRetry={() => window.location.reload()} />;
  }

  if (!data || data.length === 0) {
    return <ChartEmpty message="No revenue data available" icon={DollarSign} />;
  }

  const chartData = data.map(item => ({
    date: formatDate(item.date),
    displayName: formatDate(item.date),
    revenue: item.revenue,
    fullDate: item.date,
  }));

  return (
    <ChartContainer title="Revenue Trends" icon={DollarSign}>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart
            data={chartData}
            margin={chartMargins.withAxis}
          >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--border-light)"
            vertical={false}
          />

          <XAxis
            dataKey="displayName"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />

          <YAxis
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatCurrency(value)}
            dx={-10}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            animationBegin={300}
            animationDuration={1500}
            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
});
