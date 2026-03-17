import { useState, useMemo } from 'react';
import { useVoteTimeline, useVoteStats } from '../hooks/use-voting';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from '@/features/dashboard/components/ChartContainer';
import type { DateRange } from '../types';
import { History, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  chartColorPalette,
  gridConfig,
  axisConfig,
  tooltipConfig,
  areaChartConfig,
  animationConfig,
} from '@/features/dashboard/utils/chart-config';

interface VoteTimelineProps {
  dateRange?: DateRange;
}

export const VoteTimeline = ({ dateRange }: VoteTimelineProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: timelineData, isLoading, error } = useVoteTimeline(dateRange);
  const { data: voteStats } = useVoteStats(dateRange);

  // Build chart data — cumulative or per-category
  const chartData = useMemo(() => {
    if (!timelineData) return [];

    if (!selectedCategory) {
      // Cumulative: use all timeline data
      return timelineData.map(d => ({
        timestamp: new Date(d.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        votes: d.voteCount,
      }));
    }

    // Per-category: filter timeline entries that have a categoryId match
    // If timeline data has categoryId, filter; otherwise show cumulative with label
    const filtered = timelineData.filter(d => !d.categoryId || d.categoryId === selectedCategory);
    return filtered.map(d => ({
      timestamp: new Date(d.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      votes: d.voteCount,
    }));
  }, [timelineData, selectedCategory]);

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return 'All Categories';
    return voteStats?.find(s => s.categoryId === selectedCategory)?.categoryName ?? 'Category';
  }, [selectedCategory, voteStats]);

  if (isLoading) {
    return (
      <ChartContainer
        title="Pulse Timeline"
        description="Track the velocity of participation across categories"
        icon={History}
        isLoading
      />
    );
  }

  if (error) {
    return (
      <ChartContainer
        title="Pulse Timeline"
        description="Track the velocity of participation across categories"
        icon={History}
      >
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <History className="h-12 w-12 text-red-200 mb-4" />
          <p className="text-red-500 font-medium">Failed to load timeline data</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      title="Pulse Timeline"
      description={`Showing: ${selectedCategoryName}`}
      icon={<History className="text-primary-600" size={20} />}
      chartHeight="450px"
    >
      <div className="space-y-6">
        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap items-center bg-gray-50/60 p-2 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-4 py-1.5 text-xs font-medium transition-all duration-200 rounded-xl whitespace-nowrap',
              !selectedCategory
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5'
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/60'
            )}
          >
            Cumulative
          </button>
          {voteStats?.map((stat) => (
            <button
              key={stat.categoryId}
              onClick={() => setSelectedCategory(
                selectedCategory === stat.categoryId ? null : stat.categoryId
              )}
              className={cn(
                'px-4 py-1.5 text-xs font-medium transition-all duration-200 rounded-xl whitespace-nowrap',
                selectedCategory === stat.categoryId
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-white/60'
              )}
            >
              {stat.categoryName}
            </button>
          ))}
        </div>

        {/* Chart */}
        {chartData.length === 0 ? (
          <div className="h-[350px] flex flex-col items-center justify-center text-center">
            <TrendingUp size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No timeline data available</p>
            <p className="text-gray-300 text-sm mt-1">Data will appear as votes are cast</p>
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="votePulseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColorPalette.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={chartColorPalette.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={gridConfig.vertical}
                  horizontal={gridConfig.horizontal}
                  stroke={gridConfig.stroke}
                  strokeWidth={gridConfig.strokeWidth}
                  strokeDasharray={gridConfig.strokeDasharray}
                />
                <XAxis
                  dataKey="timestamp"
                  axisLine={axisConfig.axisLine}
                  tickLine={axisConfig.tickLine}
                  tick={axisConfig.tick}
                  dy={10}
                />
                <YAxis
                  axisLine={axisConfig.axisLine}
                  tickLine={axisConfig.tickLine}
                  tick={axisConfig.tick}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={tooltipConfig.contentStyle}
                  labelStyle={tooltipConfig.labelStyle}
                  itemStyle={tooltipConfig.itemStyle}
                  cursor={tooltipConfig.cursor}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={tooltipConfig.contentStyle}>
                          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '4px' }}>
                            {label}
                          </p>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '20px', fontWeight: 700, color: chartColorPalette.primary }}>
                              {payload[0].value?.toLocaleString()}
                            </span>
                            <TrendingUp size={14} className="text-green-500" />
                          </div>
                          <p style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', marginTop: '4px' }}>
                            Votes · {selectedCategoryName}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type={areaChartConfig.type}
                  dataKey="votes"
                  stroke={chartColorPalette.primary}
                  strokeWidth={areaChartConfig.strokeWidth}
                  fillOpacity={areaChartConfig.fillOpacity}
                  fill="url(#votePulseGradient)"
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  animationDuration={animationConfig.animationDuration}
                  animationEasing={animationConfig.animationEasing}
                  isAnimationActive={animationConfig.isAnimationActive}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};
