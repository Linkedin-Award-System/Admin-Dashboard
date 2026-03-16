import { useMemo } from 'react';
import { useVoteStats, useUniqueVoterCount } from '../hooks/use-voting';
import { Button } from '@/shared/components/ui/button';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { VotingDashboardSkeleton } from './VotingDashboardSkeleton';
import type { DateRange } from '../types';
import { 
  BarChart3, 
  Users2, 
  Layers, 
  Trophy, 
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { formatNumber } from '@/features/dashboard/utils/format-utils';

interface VotingDashboardProps {
  dateRange?: DateRange;
}

export const VotingDashboard = ({ dateRange }: VotingDashboardProps) => {
  const { data: voteStats, isLoading: isLoadingStats, error: statsError } = useVoteStats(dateRange);
  const { data: uniqueVoters, isLoading: isLoadingVoters, error: votersError } = useUniqueVoterCount();

  const totalVotes = useMemo(
    () => voteStats?.reduce((sum, stat) => sum + stat.totalVotes, 0) || 0,
    [voteStats]
  );

  const leadingNominees = useMemo(
    () => voteStats?.map(stat => stat.leadingNominee) || [],
    [voteStats]
  );

  if (isLoadingStats || isLoadingVoters) {
    return <VotingDashboardSkeleton />;
  }

  if (statsError || votersError) {
    return (
      <div className="p-12 rounded-[2rem] border border-red-100 bg-red-50/50 backdrop-blur-sm text-center">
        <TrendingUp size={48} className="mx-auto text-red-600 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-red-800">Analytics Connection Refused</h3>
        <p className="text-red-600 mt-2 max-w-md mx-auto">
          We couldn't synchronize the real-time voting data.
        </p>
        <Button variant="outline" className="mt-6 border-red-200 text-red-700 hover:bg-red-100" onClick={() => window.location.reload()}>
          Re-establish Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Metrics Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {[
          { 
            label: 'Total Votes Cast', 
            value: formatNumber(totalVotes), 
            icon: BarChart3, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
            trend: '+12.5% this week'
          },
          { 
            label: 'Unique Voters', 
            value: formatNumber(uniqueVoters || 0), 
            icon: Users2, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50',
            trend: 'Direct participation'
          },
          { 
            label: 'Active Categories', 
            value: voteStats?.length || 0, 
            icon: Layers, 
            color: 'text-green-600', 
            bg: 'bg-green-50',
            trend: 'Full coverage'
          }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-border-light shadow-sm hover:shadow-premium transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className={`p-4 ${item.bg} ${item.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </span>
              <span className="text-xs font-medium text-gray-400">{item.trend}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{item.label}</h3>
            <div className="text-3xl font-semibold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Leading Nominees Board */}
      <div className="bg-white rounded-[2.5rem] border border-border-light shadow-premium overflow-hidden">
        <div className="p-8 border-b border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <Trophy className="text-yellow-500" size={28} />
              Leading Nominees
            </h3>
            <p className="text-sm font-normal text-gray-500 mt-1">Real-time category front-runners</p>
          </div>
          
          <ExportButton
            onExport={(format) => exportService.exportVoteStats(format, dateRange)}
            filename={`vote-stats${dateRange ? `-${dateRange.startDate}` : ''}`}
            label="Download Full Audit"
            className="rounded-xl h-11 px-6 border-border-light hover:bg-bg-tertiary transition-all"
          />
        </div>

        <div className="p-2">
          {leadingNominees.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-text-tertiary" size={32} />
              </div>
              <p className="text-text-tertiary font-bold">Waiting for the first votes to be cast...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 divide-y divide-border-light/50">
              {voteStats?.map((stat, index) => (
                <div 
                  key={stat.categoryId} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-bg-tertiary/30 transition-colors rounded-2xl mx-2"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary font-black text-xs shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.categoryName}</p>
                      <h4 className="text-lg font-semibold text-gray-900 mt-0.5 group-hover:translate-x-1 transition-transform">{stat.leadingNominee.name}</h4>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xl font-semibold text-primary-600">{formatNumber(stat.leadingNominee.voteCount)}</span>
                        <TrendingUp size={16} className="text-green-500" />
                      </div>
                      <p className="text-xs font-normal text-gray-400 mt-0.5">Verified Votes</p>
                    </div>
                    <ChevronRight className="text-text-tertiary group-hover:text-primary-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
