import { memo } from 'react';
import { TrendingUp } from 'lucide-react';
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
import type { VotingTrendsChartProps } from '../types';
import {
  chartMargins,
  chartDimensions,
} from '../utils/chart-config';
import { formatDate, formatNumber } from '../utils/format-utils';

/**
 * Custom Tooltip
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <p className="text-sm font-semibold text-gray-900">
            {formatNumber(payload[0].value)} <span className="text-xs font-normal text-gray-500">Votes</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * VotingTrendsChart Component
 * 
 * Displays voting trends over time using an area chart with smooth curves
 * and rich gradient fills.
 */
export const VotingTrendsChart = memo(function VotingTrendsChart({ 
  data, 
  isLoading = false, 
  error = null 
}: VotingTrendsChartProps) {
  if (isLoading) {
    return <ChartSkeleton height={chartDimensions.height.medium} />;
  }

  if (error) {
    return <ChartError error={error} onRetry={() => window.location.reload()} />;
  }

  if (!data || data.length === 0) {
    return <ChartEmpty message="No voting data available" icon={TrendingUp} />;
  }

  const chartData = data.map(item => ({
    date: formatDate(item.date),
    displayName: formatDate(item.date),
    votes: item.votes,
    fullDate: item.date,
  }));

  return (
    <ChartContainer title="Voting Trends" icon={TrendingUp}>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart
            data={chartData}
            margin={chartMargins.withAxis}
          >
          <defs>
            <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0a66c2" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0a66c2" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />

          <XAxis
            dataKey="displayName"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />

          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatNumber(value)}
            dx={-10}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0a66c2', strokeWidth: 2 }} />

          <Area
            type="monotone"
            dataKey="votes"
            stroke="#0a66c2"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorVotes)"
            animationBegin={0}
            animationDuration={1500}
            activeDot={{ r: 6, fill: '#0a66c2', stroke: '#fff', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
});
