import { useVoteStats } from '../hooks/use-voting';
import { ChartContainer } from '@/features/dashboard/components/ChartContainer';
import type { DateRange } from '../types';
import { 
  BarChart, 
  Trophy, 
  Users, 
  TrendingUp, 
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/features/dashboard/utils/format-utils';
import { chartColorPalette } from '@/features/dashboard/utils/chart-config';

interface CategoryVoteStatsProps {
  dateRange?: DateRange;
}

export const CategoryVoteStats = ({ dateRange }: CategoryVoteStatsProps) => {
  const { data: voteStats, isLoading, error } = useVoteStats(dateRange);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-[2rem] h-[400px] animate-pulse border border-border-light shadow-sm" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 rounded-[2rem] border border-red-100 bg-red-50/50 backdrop-blur-sm text-center">
        <AlertCircle size={48} className="mx-auto text-red-600 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-red-800">Statistics Unavailable</h3>
        <p className="text-red-600 mt-2">Could not retrieve detailed category statistics.</p>
      </div>
    );
  }

  if (!voteStats || voteStats.length === 0) {
    return (
      <div className="py-20 text-center bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-border-light border-dashed">
        <Users className="text-text-tertiary mx-auto mb-4 opacity-50" size={48} />
        <h3 className="text-xl font-bold text-text-primary">No Voting Records</h3>
        <p className="text-text-tertiary mt-2 italic">Detailed statistics will appear once voting commences.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {voteStats.map((stat) => (
        <ChartContainer 
          key={stat.categoryId}
          title={stat.categoryName}
          description={`${formatNumber(stat.totalVotes)} total votes verified`}
          icon={<BarChart className="text-primary-600" size={20} />}
          className="h-full"
        >
          <div className="space-y-8 mt-4">
            {/* Top Performer Highlight */}
            <div style={{ 
              backgroundColor: `${chartColorPalette.primary}10`,
              borderColor: `${chartColorPalette.primary}20`
            }} className="border p-4 rounded-2xl flex items-center justify-between group/highlight">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Trophy size={16} style={{ color: chartColorPalette.complementary[3] }} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Front Runner</p>
                  <p className="text-sm font-black text-text-primary truncate max-w-[150px]">{stat.leadingNominee.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black tracking-tight" style={{ color: chartColorPalette.primary }}>{stat.leadingNominee.voteCount}</p>
                <p className="text-[10px] font-bold text-text-tertiary">Verified Votes</p>
              </div>
            </div>

            {/* Nominees Breakthrough */}
            <div className="space-y-6">
              {stat.nominees.map((nominee, idx) => {
                const isLeading = nominee.nomineeId === stat.leadingNominee.id;
                return (
                  <div key={nominee.nomineeId} className="group/item relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black transition-colors",
                          isLeading ? "text-white" : "bg-bg-tertiary text-text-tertiary"
                        )}
                        style={isLeading ? { backgroundColor: chartColorPalette.primary } : {}}
                        >
                          {idx + 1}
                        </span>
                        <p className={cn(
                          "text-sm font-bold transition-colors",
                          isLeading ? "text-text-primary" : "text-text-secondary"
                        )}>
                          {nominee.nomineeName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-text-primary">{nominee.percentage.toFixed(1)}%</span>
                        <TrendingUp size={12} style={{ color: isLeading ? chartColorPalette.status.success : '#d1d5db' }} />
                      </div>
                    </div>
                    
                    <div className="relative h-2.5 w-full bg-bg-tertiary/50 rounded-full overflow-hidden border border-black/5 p-[1px]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out flex items-center relative",
                          !isLeading && "bg-text-tertiary/40"
                        )}
                        style={isLeading ? {
                          background: `linear-gradient(to right, ${chartColorPalette.primary}99, ${chartColorPalette.primary})`,
                          boxShadow: `0 0 12px ${chartColorPalette.primary}4d`,
                          width: `${nominee.percentage}%`
                        } : { width: `${nominee.percentage}%` }}
                      >
                        {isLeading && (
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-[2px] animate-pulse" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-1.5 px-0.5">
                      <p className="text-[9px] font-bold text-text-tertiary/60 lowercase tracking-tight">#{nominee.nomineeId.slice(-6)}</p>
                      <p className="text-[9px] font-black text-text-tertiary">{formatNumber(nominee.voteCount)} votes</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartContainer>
      ))}
    </div>
  );
};
