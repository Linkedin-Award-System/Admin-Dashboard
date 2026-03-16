import { memo } from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartError } from './ChartError';
import { ChartEmpty } from './ChartEmpty';
import type { VotingStatusChartProps } from '../types';
import {
  chartDimensions,
} from '../utils/chart-config';
import { formatNumber } from '../utils/format-utils';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-secondary/90 backdrop-blur-md border border-border-light p-4 rounded-2xl shadow-xl space-y-2 ring-1 ring-black/5 min-w-[140px]">
        <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{payload[0].name}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
            <p className="text-lg font-bold text-text-primary">{formatNumber(payload[0].value)}</p>
          </div>
          <p className="text-xs font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
            {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * VotingStatusChart Component
 */
export const VotingStatusChart = memo(function VotingStatusChart({ 
  data, 
  isLoading = false, 
  error = null 
}: VotingStatusChartProps) {
  if (isLoading) {
    return <ChartSkeleton height={chartDimensions.height.medium} />;
  }

  if (error) {
    return <ChartError error={error} onRetry={() => window.location.reload()} />;
  }

  if (!data || data.length === 0) {
    return <ChartEmpty message="No voting status data available" icon={PieChartIcon} />;
  }

  const COLORS: Record<string, string> = {
    completed: '#10b981',
    active: '#0a66c2',
    draft: '#6b7280',
  };

  const chartData = data.map(item => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage,
    fill: COLORS[item.status.toLowerCase()] || '#6b7280',
  }));

  const totalVotes = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartContainer title="Voting Status" icon={PieChartIcon}>
      <div className="relative" style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={105}
              paddingAngle={8}
              dataKey="value"
              animationDuration={1500}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  className="hover:opacity-80 transition-opacity outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-extrabold text-text-primary tracking-tight">
            {formatNumber(totalVotes)}
          </span>
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest mt-1">
            Total
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="text-xs font-semibold text-text-secondary">{entry.name}</span>
            <span className="text-[10px] font-bold text-text-tertiary">{entry.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
});
