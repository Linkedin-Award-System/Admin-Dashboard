import { memo } from 'react';
import { BarChart3 } from 'lucide-react';
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
import type { VotesByCategoryChartProps } from '../types';
import {
  chartMargins,
  chartDimensions,
  chartColorPalette,
} from '../utils/chart-config';
import { formatNumber } from '../utils/format-utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-secondary/90 backdrop-blur-md border border-border-light p-4 rounded-2xl shadow-xl space-y-2 ring-1 ring-black/5">
        <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(10,102,194,0.5)]" />
          <p className="text-lg font-bold text-text-primary">
            {formatNumber(payload[0].value)} <span className="text-sm font-normal text-text-secondary ml-1">Votes</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * VotesByCategoryChart Component
 */
export const VotesByCategoryChart = memo(function VotesByCategoryChart({ 
  data, 
  isLoading = false, 
  error = null 
}: VotesByCategoryChartProps) {
  if (isLoading) {
    return <ChartSkeleton height={chartDimensions.height.medium} />;
  }

  if (error) {
    return <ChartError error={error} onRetry={() => window.location.reload()} />;
  }

  if (!data || data.length === 0) {
    return <ChartEmpty message="No category voting data available" icon={BarChart3} />;
  }

  const chartData = data.map(item => ({
    category: item.category,
    votes: item.votes,
  }));

  return (
    <ChartContainer title="Votes by Category" icon={BarChart3}>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart
            data={chartData}
            margin={{ ...chartMargins.withAxis, bottom: 40 }}
            barSize={40}
          >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--border-light)"
            vertical={false}
          />

          <XAxis
            dataKey="category"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            dy={10}
          />

          <YAxis
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatNumber(value)}
            dx={-10}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--primary-500)', opacity: 0.05 }} />

          <Bar
            dataKey="votes"
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColorPalette.complementary[index % chartColorPalette.complementary.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
});
