import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { VotingDashboard, CategoryVoteStats, VoteTimeline, DateRangeFilter } from '@/features/voting';
import type { DateRange } from '@/features/voting';

export const VotingPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Voting Monitoring</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Real-time voting statistics and analytics
          </p>
        </div>

        <DateRangeFilter onFilterChange={setDateRange} />

        <VotingDashboard dateRange={dateRange} />

        <VoteTimeline dateRange={dateRange} />

        <CategoryVoteStats dateRange={dateRange} />
      </div>
    </Layout>
  );
};

export default VotingPage;
