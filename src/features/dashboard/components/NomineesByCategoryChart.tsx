import { memo } from 'react';
import { Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartEmpty } from './ChartEmpty';
import type { NomineesByCategoryChartProps } from '../types';
import { formatNumber } from '../utils/format-utils';

const COLORS = ['#a855f7', '#0a66c2', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

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
      <div style={{ color: '#c084fc', fontSize: 15 }}>{formatNumber(payload[0].value)} nominees</div>
    </div>
  );
};

export const NomineesByCategoryChart = memo(function NomineesByCategoryChart({
  data, isLoading = false, error = null,
}: NomineesByCategoryChartProps) {
  if (isLoading) return <ChartSkeleton height={280} />;
  if (error || !data?.length) return (
    <ChartContainer title="Nominees by Category" icon={Users} chartHeight="240px">
      <ChartEmpty message="No nominee category data" icon={Users} />
    </ChartContainer>
  );

  return (
    <ChartContainer title="Nominees by Category" icon={Users} chartHeight="240px">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 40 }} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false} tickLine={false}
            interval={0} angle={-30} textAnchor="end" dy={8}
          />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} dx={-4} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(168,85,247,0.05)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});
