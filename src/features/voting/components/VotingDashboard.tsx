import { useMemo, useState } from 'react';
import { useVoteStats } from '../hooks/use-voting';
import { Button } from '@/shared/components/ui/button';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { VotingDashboardSkeleton } from './VotingDashboardSkeleton';
import type { DateRange } from '../types';
import {
  Trophy,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Target,
  Medal,
  AlertCircle,
} from 'lucide-react';
import { formatNumber } from '@/features/dashboard/utils/format-utils';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;

interface VotingDashboardProps {
  dateRange?: DateRange;
}

export const VotingDashboard = ({ dateRange }: VotingDashboardProps) => {
  const { data: voteStats, isLoading, error } = useVoteStats(dateRange);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const totalVotes = useMemo(
    () => voteStats?.reduce((sum, stat) => sum + stat.totalVotes, 0) || 0,
    [voteStats]
  );

  // Sort categories by total votes descending for the leaderboard
  const sortedStats = useMemo(
    () => [...(voteStats ?? [])].sort((a, b) => b.totalVotes - a.totalVotes),
    [voteStats]
  );

  const totalPages = Math.max(1, Math.ceil(sortedStats.length / PAGE_SIZE));
  const pagedStats = sortedStats.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <VotingDashboardSkeleton />;

  if (error) {
    return (
      <div className="p-12 rounded-[2rem] border border-red-100 bg-red-50/50 text-center">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-800">Could not load voting data</h3>
        <p className="text-red-500 mt-1 text-sm">Check your connection and try refreshing.</p>
        <Button variant="outline" className="mt-5 border-red-200 text-red-700 hover:bg-red-50" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Trophy size={20} className="text-yellow-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Leading Nominees</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {sortedStats.length} categories · {formatNumber(totalVotes)} total votes
            </p>
          </div>
        </div>

        <ExportButton
          onExport={(format) => exportService.exportVoteStats(format, voteStats ?? [])}
          filename={`vote-stats${dateRange ? `-${dateRange.startDate}-${dateRange.endDate}` : ''}`}
          label="Export Results"
          className="rounded-xl h-10 px-5 text-sm border-gray-200 hover:bg-gray-50 transition-all"
        />
      </div>

      {/* Body */}
      {sortedStats.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-400 font-medium">No votes recorded yet</p>
          <p className="text-gray-300 text-sm mt-1">Results will appear once voting begins</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-50">
            {pagedStats.map((stat, index) => {
              const globalIndex = (page - 1) * PAGE_SIZE + index;
              const rankColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
              const rankBg = ['bg-yellow-50', 'bg-gray-50', 'bg-amber-50'];
              const isTop3 = globalIndex < 3;

              return (
                <div
                  key={stat.categoryId}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between px-8 py-5 hover:bg-gray-50/60 transition-colors cursor-pointer"
                  onClick={() => {
                    if (stat.leadingNominee.id) {
                      navigate(`/nominees/${stat.leadingNominee.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && stat.leadingNominee.id) {
                      navigate(`/nominees/${stat.leadingNominee.id}`);
                    }
                  }}
                >
                  {/* Left: rank + category + nominee */}
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-semibold text-sm ${isTop3 ? rankBg[globalIndex] + ' ' + rankColors[globalIndex] : 'bg-gray-50 text-gray-400'}`}>
                      {isTop3 ? <Medal size={16} /> : globalIndex + 1}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.categoryName}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5 group-hover:text-blue-700 transition-colors">
                        {stat.leadingNominee.name || 'No nominees yet'}
                      </p>
                    </div>
                  </div>

                  {/* Right: vote count + category total + arrow */}
                  <div className="mt-3 sm:mt-0 flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-lg font-semibold text-blue-700">
                          {formatNumber(stat.leadingNominee.voteCount)}
                        </span>
                        <TrendingUp size={14} className="text-green-500" />
                      </div>
                      <p className="text-xs text-gray-400">
                        of {formatNumber(stat.totalVotes)} in category
                      </p>
                    </div>

                    {/* Mini progress bar */}
                    <div className="hidden sm:block w-24">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{
                            width: stat.totalVotes > 0
                              ? `${Math.min(100, (stat.leadingNominee.voteCount / stat.totalVotes) * 100)}%`
                              : '0%'
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {stat.totalVotes > 0
                          ? `${((stat.leadingNominee.voteCount / stat.totalVotes) * 100).toFixed(0)}%`
                          : '0%'}
                      </p>
                    </div>

                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sortedStats.length)} of {sortedStats.length} categories
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 w-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-sm font-medium text-gray-600">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-8 w-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
