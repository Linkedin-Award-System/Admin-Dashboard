import { memo } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartEmpty } from './ChartEmpty';
import type { VotingTrendsChartProps } from '../types';
import { formatDate, formatNumber } from '../utils/format-utils';

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
      <div style={{ color: '#60a5fa', fontSize: 15 }}>{formatNumber(payload[0].value)} votes</div>
    </div>
  );
};

export const VotingTrendsChart = memo(function VotingTrendsChart({
  data, isLoading = false, error = null,
}: VotingTrendsChartProps) {
  if (isLoading) return <ChartSkeleton height={280} />;
  if (error || !data?.length) return (
    <ChartContainer title="Voting Trends" icon={TrendingUp} chartHeight="240px">
      <ChartEmpty message="No voting trend data" icon={TrendingUp} />
    </ChartContainer>
  );

  const chartData = data.map(d => ({ date: formatDate(d.date), votes: d.votes }));

  return (
    <ChartContainer title="Voting Trends" icon={TrendingUp} chartHeight="240px">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a66c2" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0a66c2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} dy={6} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} dx={-4} />
          <Tooltip content={<Tip />} cursor={{ stroke: '#0a66c2', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone" dataKey="votes"
            stroke="#0a66c2" strokeWidth={2.5}
            fill="url(#voteGrad)"
            activeDot={{ r: 5, fill: '#0a66c2', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});
