import { useState, useCallback, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Layout } from '@/shared/components/layout';
import { PageHeader } from '@/shared/design-system/patterns/PageHeader/PageHeader';
import { Skeleton } from '@/shared/design-system/components/Skeleton/Skeleton';
import { Button } from '@/shared/design-system/components/Button/Button';
import { useVoters } from '@/features/voters/hooks/use-voters';
import { getStats } from '@/features/voters/services/voter-service';
import { VoterStatsCards } from '@/features/voters/components/VoterStatsCards';
import { VoterDetailPanel } from '@/features/voters/components/VoterDetailPanel';
import { generateCSV } from '@/features/exports/utils/csv-generator';
import { cn } from '@/shared/design-system/utils/cn';
import { formatNumber } from '@/features/dashboard/utils/format-utils';
import type { Voter } from '@/features/voters/types';

const LIMIT = 25;

function exportVotersCSV(voters: Voter[]) {
  const rows = voters.map((v) => ({
    userId: v.userId,
    userName: v.userName ?? '',
    email: v.userEmail ?? '',
    totalVotes: v.totalVotes,
    totalSpent: v.totalSpent,
    firstVotedAt: v.firstVotedAt ?? '',
    lastVotedAt: v.lastVotedAt ?? '',
  }));
  const headers = [
    { key: 'userId' as const, label: 'User ID' },
    { key: 'userName' as const, label: 'Name' },
    { key: 'email' as const, label: 'Email' },
    { key: 'totalVotes' as const, label: 'Total Votes' },
    { key: 'totalSpent' as const, label: 'Total Spent (ETB)' },
    { key: 'firstVotedAt' as const, label: 'First Voted' },
    { key: 'lastVotedAt' as const, label: 'Last Voted' },
  ];
  const blob = generateCSV(rows, headers);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'voters.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function VotersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(val), 350);
  }, []);

  const { data, isLoading, error, refetch } = useVoters(page, LIMIT, debouncedSearch);

  const voters = data?.voters ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const stats = getStats(voters);

  const toggleExpand = (userId: string) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const startItem = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const endItem = Math.min(page * LIMIT, total);

  const emptyMessage = debouncedSearch
    ? 'No voters match your search. Try a different search term.'
    : 'No voters yet. Voters will appear here once voting begins.';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Voters"
          subtitle="All registered voters and their voting activity"
          actions={
            <Button
              variant="secondary"
              size="md"
              onClick={() => exportVotersCSV(voters)}
              disabled={voters.length === 0}
            >
              Export CSV
            </Button>
          }
        />

        {/* Stats Cards */}
        <VoterStatsCards stats={isLoading ? undefined : stats} isLoading={isLoading} />

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by voter ID or nominee…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={cn(
              'w-full h-10 pl-9 pr-8 rounded-lg border border-gray-300 bg-white',
              'text-sm text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:border-2 focus:border-primary-600 transition-all duration-200'
            )}
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Error State */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-sm font-semibold text-red-600">Failed to load voters.</p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Voter
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Total Votes
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Total Spent
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Last Voted
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 w-12">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Loading skeleton rows */}
                    {isLoading &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={`skel-${i}`} className="border-b border-gray-200">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Skeleton className="h-4 w-12 ml-auto" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Skeleton className="h-4 w-12 ml-auto" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Skeleton className="h-4 w-10 ml-auto" />
                          </td>
                          <td className="px-4 py-3" />
                        </tr>
                      ))}

                    {/* Empty state */}
                    {!isLoading && voters.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-16 text-center">
                          <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">{emptyMessage}</p>
                        </td>
                      </tr>
                    )}

                    {/* Data rows */}
                    {!isLoading &&
                      voters.map((voter, rowIndex) => {
                        const isExpanded = expandedUserId === voter.userId;

                        return (
                          <Fragment key={voter.userId}>
                            <tr
                              className={cn(
                                'border-b border-gray-200 cursor-pointer transition-colors',
                                rowIndex % 2 === 1 && !isExpanded && 'bg-gray-50',
                                isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'
                              )}
                              onClick={() => toggleExpand(voter.userId)}
                            >
                              {/* Voter column */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-9 w-9 rounded-lg shrink-0 bg-gradient-to-br from-[#0a66c2] to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                                    {(voter.userEmail ?? voter.userName ?? voter.userId).charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                                      {voter.userEmail ?? voter.userName ?? voter.userId}
                                    </div>
                                    {voter.userName && (
                                      <div className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-xs">
                                        {voter.userName}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Total Votes */}
                              <td className="px-4 py-3 text-right text-sm text-gray-900">
                                {formatNumber(voter.totalVotes)}
                              </td>

                              {/* Total Spent */}
                              <td className="px-4 py-3 text-right text-sm text-gray-900">
                                ETB {formatNumber(voter.totalSpent)}
                              </td>

                              {/* Last Voted */}
                              <td className="px-4 py-3 text-right text-sm text-gray-500">
                                {voter.lastVotedAt
                                  ? new Date(voter.lastVotedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                  : '—'}
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3 text-center">
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-gray-400 mx-auto" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-400 mx-auto" />
                                )}
                              </td>
                            </tr>

                            {/* Expansion row */}
                            {isExpanded && (
                              <tr key={`${voter.userId}-detail`} className="border-b border-gray-200">
                                <td colSpan={5} className="p-0">
                                  <VoterDetailPanel
                                    voter={voter}
                                    onNavigate={(nomineeId) => navigate(`/nominees/${nomineeId}`, { state: { backLabel: 'Back to Voters' } })}
                                  />
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                  {/* Count info */}
                  <p className="text-xs text-gray-500 tabular-nums">
                    Showing{' '}
                    <span className="font-semibold text-gray-700">{formatNumber(startItem)}</span>
                    {' '}–{' '}
                    <span className="font-semibold text-gray-700">{formatNumber(endItem)}</span>
                    {' '}of{' '}
                    <span className="font-semibold text-gray-700">{formatNumber(total)}</span>
                    {' '}voters
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* First page */}
                    <button
                      type="button"
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className={cn(
                        'h-8 px-2.5 flex items-center justify-center rounded-lg border text-xs font-medium transition-all',
                        page === 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white'
                          : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer bg-white'
                      )}
                      aria-label="First page"
                    >
                      «
                    </button>

                    {/* Prev */}
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={cn(
                        'h-8 w-8 flex items-center justify-center rounded-lg border text-sm transition-all',
                        page === 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white'
                          : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer bg-white'
                      )}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Smart page numbers with ellipsis */}
                    {(() => {
                      const pages: (number | '…')[] = [];
                      for (let i = 1; i <= totalPages; i++) {
                        if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
                          pages.push(i);
                        } else if (pages[pages.length - 1] !== '…') {
                          pages.push('…');
                        }
                      }
                      return pages.map((p, idx) =>
                        p === '…' ? (
                          <span key={`e-${idx}`} className="h-8 w-8 flex items-center justify-center text-sm text-gray-400 select-none">
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPage(p as number)}
                            className={cn(
                              'h-8 w-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all',
                              page === p
                                ? 'bg-[#0a66c2] text-white shadow-md shadow-blue-200 border border-[#0a66c2]'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-sm cursor-pointer'
                            )}
                            aria-label={`Page ${p}`}
                            aria-current={page === p ? 'page' : undefined}
                          >
                            {p}
                          </button>
                        )
                      );
                    })()}

                    {/* Next */}
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className={cn(
                        'h-8 w-8 flex items-center justify-center rounded-lg border text-sm transition-all',
                        page === totalPages
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white'
                          : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer bg-white'
                      )}
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Last page */}
                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      className={cn(
                        'h-8 px-2.5 flex items-center justify-center rounded-lg border text-xs font-medium transition-all',
                        page === totalPages
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white'
                          : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer bg-white'
                      )}
                      aria-label="Last page"
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default VotersPage;
