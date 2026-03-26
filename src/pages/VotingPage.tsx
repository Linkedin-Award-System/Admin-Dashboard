import { useState, useMemo } from 'react';
import { Layout } from '@/shared/components/layout';
import { VotingDashboard, CategoryVoteStats, VoteTimeline, DateRangeFilter } from '@/features/voting';
import type { DateRange } from '@/features/voting';
import { BarChart3, Users2, Layers, RefreshCw } from 'lucide-react';
import { useVoteStats, useUniqueVoterCount } from '@/features/voting/hooks/use-voting';
import { formatNumber } from '@/features/dashboard/utils/format-utils';
import { useQueryClient } from '@tanstack/react-query';
import { applyFilters, type SortOrder, type CategoryFilter } from '@/features/voting/utils/category-filter-utils';
import { CategoryFilterBar } from '@/features/voting/components/CategoryFilterBar';

// Summary bar shown at the top of the page
function VotingSummaryBar({ dateRange }: { dateRange?: DateRange }) {
  const { data: voteStats, isLoading: loadingStats, dataUpdatedAt } = useVoteStats(dateRange);
  const { data: uniqueVoters, isLoading: loadingVoters } = useUniqueVoterCount();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const totalVotes = voteStats?.reduce((sum, s) => sum + s.totalVotes, 0) ?? 0;
  const activeCategories = voteStats?.length ?? 0;
  const loading = loadingStats || loadingVoters;

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['vote-stats'] });
    await queryClient.invalidateQueries({ queryKey: ['vote-timeline'] });
    await queryClient.invalidateQueries({ queryKey: ['unique-voters'] });
    setTimeout(() => setRefreshing(false), 800);
  };

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  const stats = [
    { label: 'Total Votes', value: loading ? '—' : formatNumber(totalVotes), icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Unique Voters', value: loading ? '—' : formatNumber(uniqueVoters ?? 0), icon: Users2, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Categories', value: loading ? '—' : String(activeCategories), icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex flex-1 flex-wrap gap-6">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className={`p-2 rounded-xl ${s.bg} ${s.color}`}>
              <s.icon size={16} />
            </span>
            <div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-lg font-semibold text-gray-900 leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {lastUpdated && (
          <span className="text-xs text-gray-400">Updated {lastUpdated}</span>
        )}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    </div>
  );
}

export const VotingPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOrder>('most-votes');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const { data: voteStats } = useVoteStats(dateRange);
  const totalCount = voteStats?.length ?? 0;
  const filteredCount = applyFilters(voteStats ?? [], search, sort, categoryFilter).length;
  const isFiltered = search !== '' || sort !== 'most-votes' || categoryFilter !== 'all';
  const handleReset = () => { setSearch(''); setSort('most-votes'); setCategoryFilter('all'); };

  // Build category options from live vote stats
  const categoryOptions = useMemo(
    () => (voteStats ?? []).map(s => ({ id: s.categoryId, name: s.categoryName })),
    [voteStats]
  );

  return (
    <Layout>
      <div className="container mx-auto px-6 sm:px-12 py-8 sm:py-12 space-y-8 max-w-7xl">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voting Hub</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time monitoring of platform-wide voting activity</p>
          </div>
          <DateRangeFilter onFilterChange={setDateRange} />
        </div>

        {/* Summary Stats Bar */}
        <VotingSummaryBar dateRange={dateRange} />

        {/* Leading Nominees + Metrics */}
        <VotingDashboard dateRange={dateRange} />

        {/* Pulse Timeline */}
        <VoteTimeline dateRange={dateRange} />

        {/* Per-Category Breakdown */}
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
              <p className="text-sm text-gray-500 mt-0.5">Detailed vote distribution per category</p>
            </div>
            <CategoryFilterBar
              search={search}
              onSearchChange={setSearch}
              sort={sort}
              onSortChange={setSort}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              categories={categoryOptions}
              totalCount={totalCount}
              filteredCount={filteredCount}
              isFiltered={isFiltered}
              onReset={handleReset}
            />
          </div>
          <CategoryVoteStats
            dateRange={dateRange}
            search={search}
            sort={sort}
            categoryFilter={categoryFilter}
            onReset={handleReset}
          />
        </div>

      </div>
    </Layout>
  );
};

export default VotingPage;
