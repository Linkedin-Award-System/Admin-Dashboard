import { Layout } from '@/shared/components/layout';
import { useAuthStore } from '@/features/auth';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  FolderOpen, 
  BarChart3
} from 'lucide-react';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import { MetricCardSkeleton } from '@/features/dashboard/components/MetricCardSkeleton';
import { VotingTrendsChart } from '@/features/dashboard/components/VotingTrendsChart';
import { VotesByCategoryChart } from '@/features/dashboard/components/VotesByCategoryChart';
import { RevenueTrendsChart } from '@/features/dashboard/components/RevenueTrendsChart';
import { PaymentStatusChart } from '@/features/dashboard/components/PaymentStatusChart';
import { NomineesByCategoryChart } from '@/features/dashboard/components/NomineesByCategoryChart';
import { NomineeStatusChart } from '@/features/dashboard/components/NomineeStatusChart';
import { 
  useDashboardMetrics, 
  useVotingTrends, 
  useVotesByCategory, 
  useRevenueTrends,
  usePaymentStatus,
  useNomineesByCategory,
  useNomineeStatus
} from '@/features/dashboard/hooks/use-dashboard-analytics';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: metrics, isLoading, error } = useDashboardMetrics();
  
  const { data: votingTrends, isLoading: isLoadingTrends, error: trendsError } = useVotingTrends();
  const { data: votesByCategory, isLoading: isLoadingByCategory, error: byCategoryError } = useVotesByCategory();
  const { data: revenueTrends, isLoading: isLoadingRevenue, error: revenueError } = useRevenueTrends();
  const { data: paymentStatus, isLoading: isLoadingPayments, error: paymentsError } = usePaymentStatus();
  const { data: nomineesByCategory, isLoading: isLoadingNomineesByCategory, error: nomineesByCategoryError } = useNomineesByCategory();
  const { data: nomineeStatus, isLoading: isLoadingNomineeStatus, error: nomineeStatusError } = useNomineeStatus();

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Executive Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome to the command center, {user?.name || 'Admin'}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <div className="text-red-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">Error loading metrics</p>
              <p className="text-xs text-red-600 mt-0.5">
                {error instanceof Error ? error.message : 'Failed to load dashboard data'}
              </p>
            </div>
          </div>
        )}

        {/* Core Performance Metrics */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Core Performance</h2>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <MetricCardSkeleton key={i} />)
            ) : metrics ? (
              <>
                <MetricCard
                  title="Verified Votes"
                  value={metrics.totalVotes}
                  icon={TrendingUp}
                  format="number"
                  colorScheme="blue"
                  trend={metrics.trends?.votes}
                />
                <MetricCard
                  title="Gross Revenue"
                  value={metrics.totalRevenue}
                  icon={DollarSign}
                  format="currency"
                  colorScheme="green"
                  trend={metrics.trends?.revenue}
                />
                <MetricCard
                  title="Platform Nominees"
                  value={metrics.totalNominees}
                  icon={Users}
                  format="number"
                  colorScheme="purple"
                  trend={metrics.trends?.nominees}
                />
                <MetricCard
                  title="Designated Categories"
                  value={metrics.totalCategories}
                  icon={FolderOpen}
                  format="number"
                  colorScheme="orange"
                  trend={metrics.trends?.categories}
                />
              </>
            ) : null}
          </div>
        </section>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Voting & Revenue (2/3 width) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Voting Intelligence */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Voting Intelligence</h3>
              </div>
              
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <VotingTrendsChart 
                  data={votingTrends || []} 
                  isLoading={isLoadingTrends} 
                  error={trendsError} 
                />
                <VotesByCategoryChart 
                  data={votesByCategory || []} 
                  isLoading={isLoadingByCategory} 
                  error={byCategoryError} 
                />
              </div>
            </section>

            {/* Revenue Stream */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={18} className="text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Revenue Stream</h3>
              </div>
              
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <RevenueTrendsChart 
                  data={revenueTrends || []} 
                  isLoading={isLoadingRevenue} 
                  error={revenueError} 
                />
                <PaymentStatusChart 
                  data={paymentStatus || []} 
                  isLoading={isLoadingPayments} 
                  error={paymentsError} 
                />
              </div>
            </section>
          </div>

          {/* Right Column - Nominee Pulse (1/3 width) */}
          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Nominee Pulse</h3>
              </div>
              
              <div className="space-y-6">
                <NomineesByCategoryChart 
                  data={nomineesByCategory || []} 
                  isLoading={isLoadingNomineesByCategory} 
                  error={nomineesByCategoryError} 
                />
                <NomineeStatusChart 
                  data={nomineeStatus || []} 
                  isLoading={isLoadingNomineeStatus} 
                  error={nomineeStatusError} 
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;
