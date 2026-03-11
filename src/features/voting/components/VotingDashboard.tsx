import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useVoteStats, useUniqueVoterCount } from '../hooks/use-voting';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { VotingDashboardSkeleton } from './VotingDashboardSkeleton';
import type { DateRange } from '../types';

interface VotingDashboardProps {
  dateRange?: DateRange;
}

export const VotingDashboard = ({ dateRange }: VotingDashboardProps) => {
  const { data: voteStats, isLoading: isLoadingStats, error: statsError } = useVoteStats(dateRange);
  const { data: uniqueVoters, isLoading: isLoadingVoters, error: votersError } = useUniqueVoterCount();

  // Memoize expensive computations
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
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">
          Error loading voting statistics. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end">
        <ExportButton
          onExport={(format) => exportService.exportVoteStats(format, dateRange)}
          filename={`vote-stats${dateRange ? `-${dateRange.startDate}-to-${dateRange.endDate}` : ''}`}
          label="Export Vote Stats"
          aria-label="Export voting statistics to CSV or PDF"
          className="w-full sm:w-auto"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" role="region" aria-label="Voting statistics summary">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" aria-label={`${totalVotes.toLocaleString()} total votes`}>
              {totalVotes.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Unique Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" aria-label={`${uniqueVoters?.toLocaleString() || 0} unique voters`}>
              {uniqueVoters?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" aria-label={`${voteStats?.length || 0} categories`}>
              {voteStats?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leading Nominees</CardTitle>
        </CardHeader>
        <CardContent>
          {leadingNominees.length === 0 ? (
            <p className="text-muted-foreground">No votes yet</p>
          ) : (
            <div className="space-y-4" role="list" aria-label="Leading nominees by category">
              {voteStats?.map((stat) => (
                <div 
                  key={stat.categoryId} 
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                  role="listitem"
                >
                  <div>
                    <p className="font-medium">{stat.categoryName}</p>
                    <p className="text-sm text-muted-foreground">{stat.leadingNominee.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" aria-label={`${stat.leadingNominee.voteCount.toLocaleString()} votes`}>
                      {stat.leadingNominee.voteCount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">votes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
