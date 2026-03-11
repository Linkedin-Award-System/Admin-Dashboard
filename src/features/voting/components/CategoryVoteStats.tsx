import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useVoteStats } from '../hooks/use-voting';
import type { DateRange } from '../types';

interface CategoryVoteStatsProps {
  dateRange?: DateRange;
}

export const CategoryVoteStats = ({ dateRange }: CategoryVoteStatsProps) => {
  const { data: voteStats, isLoading, error } = useVoteStats(dateRange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading category statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">
          Error loading category statistics. Please try again later.
        </p>
      </div>
    );
  }

  if (!voteStats || voteStats.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No voting data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {voteStats.map((stat) => (
        <Card key={stat.categoryId}>
          <CardHeader>
            <CardTitle>{stat.categoryName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total Votes: {stat.totalVotes.toLocaleString()}
            </p>
            <p className="text-sm font-medium">
              Leading: {stat.leadingNominee.name} ({stat.leadingNominee.voteCount.toLocaleString()} votes)
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stat.nominees.map((nominee) => (
                <div key={nominee.nomineeId} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{nominee.nomineeName}</p>
                    <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${nominee.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-bold">{nominee.voteCount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{nominee.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
