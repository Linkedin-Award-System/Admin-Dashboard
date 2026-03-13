import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { VotingDashboard, CategoryVoteStats, VoteTimeline, DateRangeFilter } from '@/features/voting';
import type { DateRange } from '@/features/voting';
import { PageHeader } from '@/shared/design-system/patterns/PageHeader/PageHeader';

export const VotingPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <Layout>
      <div className="container mx-auto px-6 sm:px-12 py-8 sm:py-12 space-y-8 max-w-7xl">
        {/* Page Header with DateRangeFilter in actions */}
        <PageHeader
          title="Voting Intelligence"
          subtitle="Real-time monitoring of platform-wide voting activity"
          actions={<DateRangeFilter onFilterChange={setDateRange} />}
        />

        {/* Analytics Content */}
        <div className="space-y-8">
          <VotingDashboard dateRange={dateRange} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <VoteTimeline dateRange={dateRange} />
            <CategoryVoteStats dateRange={dateRange} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VotingPage;
