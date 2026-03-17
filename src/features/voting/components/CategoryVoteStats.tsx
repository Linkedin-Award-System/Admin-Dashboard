import { useState } from 'react';
import { useVoteStats } from '../hooks/use-voting';
import type { DateRange } from '../types';
import {
  BarChart2,
  Trophy,
  Users,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/features/dashboard/utils/format-utils';
import { chartColorPalette } from '@/features/dashboard/utils/chart-config';

interface CategoryVoteStatsProps {
  dateRange?: DateRange;
}

function CategoryCard({ stat }: { stat: import('../types').VoteStats }) {
  const [expanded, setExpanded] = useState(true);
  const maxVotes = stat.nominees[0]?.voteCount ?? 0;

  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <BarChart2 size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{stat.categoryName}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{formatNumber(stat.totalVotes)} total votes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/nominees?category=${stat.categoryId}`}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            onClick={e => e.stopPropagation()}
          >
            View nominees <ExternalLink size={11} />
          </a>
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Front Runner Banner */}
      <div
        className="mx-4 mt-4 px-4 py-3 rounded-xl flex items-center justify-between"
        style={{ backgroundColor: `${chartColorPalette.primary}0d`, border: `1px solid ${chartColorPalette.primary}20` }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <Trophy size={13} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider leading-none">Front Runner</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate max-w-[160px]">
              {stat.leadingNominee.name || 'No nominees yet'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold" style={{ color: chartColorPalette.primary }}>
            {formatNumber(stat.leadingNominee.voteCount)}
          </p>
          <p className="text-xs text-gray-400">votes</p>
        </div>
      </div>

      {/* Nominees List */}
      {expanded && (
        <div className="px-4 pb-4 mt-4 space-y-4">
          {stat.nominees.length === 0 ? (
            <div className="py-8 text-center">
              <Users size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No nominees in this category</p>
            </div>
          ) : (
            stat.nominees.map((nominee, idx) => {
              const isLeader = nominee.nomineeId === stat.leadingNominee.id;
              const barWidth = maxVotes > 0 ? (nominee.voteCount / maxVotes) * 100 : 0;

              return (
                <div
                  key={nominee.nomineeId}
                  className="group cursor-pointer"
                  onClick={() => window.location.assign(`/nominees?id=${nominee.nomineeId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') window.location.assign(`/nominees?id=${nominee.nomineeId}`); }}
                >
                  {/* Name row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-5 h-5 rounded-md flex items-center justify-center text-xs font-semibold shrink-0',
                          isLeader ? 'text-white' : 'bg-gray-100 text-gray-400'
                        )}
                        style={isLeader ? { backgroundColor: chartColorPalette.primary } : {}}
                      >
                        {idx + 1}
                      </span>
                      <p className={cn(
                        'text-sm font-medium truncate max-w-[180px] group-hover:text-blue-700 transition-colors',
                        isLeader ? 'text-gray-900' : 'text-gray-600'
                      )}>
                        {nominee.nomineeName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-semibold text-gray-700">{formatNumber(nominee.voteCount)}</span>
                      <span className="text-xs text-gray-400">({nominee.percentage.toFixed(1)}%)</span>
                      {isLeader && <TrendingUp size={11} className="text-green-500" />}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barWidth}%`,
                        background: isLeader
                          ? `linear-gradient(to right, ${chartColorPalette.primary}99, ${chartColorPalette.primary})`
                          : '#d1d5db',
                        boxShadow: isLeader ? `0 0 8px ${chartColorPalette.primary}40` : 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export const CategoryVoteStats = ({ dateRange }: CategoryVoteStatsProps) => {
  const { data: voteStats, isLoading, error } = useVoteStats(dateRange);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[1.5rem] h-64 animate-pulse border border-gray-100 shadow-sm" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 rounded-[1.5rem] border border-red-100 bg-red-50/50 text-center">
        <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
        <h3 className="text-base font-semibold text-red-800">Statistics unavailable</h3>
        <p className="text-red-500 text-sm mt-1">Could not retrieve category statistics.</p>
      </div>
    );
  }

  if (!voteStats || voteStats.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-[1.5rem] border border-dashed border-gray-200">
        <Users className="text-gray-200 mx-auto mb-3" size={40} />
        <h3 className="text-base font-semibold text-gray-500">No voting records yet</h3>
        <p className="text-gray-400 text-sm mt-1">Category breakdowns will appear once voting begins.</p>
      </div>
    );
  }

  // Sort by total votes descending
  const sorted = [...voteStats].sort((a, b) => b.totalVotes - a.totalVotes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sorted.map((stat) => (
        <CategoryCard key={stat.categoryId} stat={stat} />
      ))}
    </div>
  );
};
