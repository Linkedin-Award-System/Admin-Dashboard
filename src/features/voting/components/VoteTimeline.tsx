import { useState } from 'react';
import { useVoteTimeline, useVoteStats } from '../hooks/use-voting';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
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
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { data: timelineData, isLoading: isLoadingTimeline, error: timelineError } = useVoteTimeline(dateRange);
  const { data: voteStats } = useVoteStats(dateRange);

  if (isLoadingTimeline) {
    return (
      <ChartContainer 
        title="Pulse Timeline" 
        description="Real-time voting velocity" 
        icon={History}
        isLoading 
      />
    );
  }

  if (timelineError) {
    return (
      <ChartContainer 
        title="Pulse Timeline" 
        description="Real-time voting velocity"
        icon={History}
      >
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <History className="h-12 w-12 text-red-200 mb-4" />
          <p className="text-red-600 font-bold">Failed to sync timeline data</p>
        </div>
      </ChartContainer>
    );
  }

  const filteredData = selectedCategory
    ? timelineData?.filter(d => d.categoryId === selectedCategory)
    : timelineData;

  const chartData = filteredData?.map(d => ({
    timestamp: new Date(d.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    votes: d.voteCount,
    rawDate: d.timestamp
  })) || [];

  return (
    <ChartContainer 
      title="Pulse Timeline" 
      description="Track the velocity of participation across categories"
      icon={<History className="text-primary-600" size={20} />}
      chartHeight="450px"
    >
      <div className="space-y-6">
        {/* Premium Category Pills */}
        <div className="flex gap-2 flex-wrap items-center bg-bg-tertiary/30 p-2 rounded-2xl border border-border-light ring-1 ring-black/5 overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={cn(
              "px-4 py-1.5 text-xs font-black transition-all duration-300 rounded-xl whitespace-nowrap",
              !selectedCategory
                ? "bg-white text-primary-600 shadow-sm ring-1 ring-black/5 scale-105"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            Cumulative
          </button>
          {voteStats?.map((stat) => (
            <button
              key={stat.categoryId}
              onClick={() => setSelectedCategory(stat.categoryId)}
              className={cn(
                "px-4 py-1.5 text-xs font-black transition-all duration-300 rounded-xl whitespace-nowrap",
                selectedCategory === stat.categoryId
                  ? "bg-white text-primary-600 shadow-sm ring-1 ring-black/5 scale-105"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {stat.categoryName}
            </button>
          ))}
        </div>

        <div className="h-[350px] w-full" style={{ minHeight: '350px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="votePulseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColorPalette.primary} stopOpacity={0.15}/>
                  <stop offset="95%" stopColor={chartColorPalette.primary} stopOpacity={0}/>
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
                        <p style={{ ...tooltipConfig.labelStyle, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '20px', fontWeight: 700, color: chartColorPalette.primary }}>
                            {payload[0].value?.toLocaleString()}
                          </span>
                          <TrendingUp size={14} className="text-green-500" />
                        </div>
                        <p style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', marginTop: '4px' }}>Total Votes Recorded</p>
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
      </div>
    </ChartContainer>
  );
};
