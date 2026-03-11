import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useVoteTimeline, useVoteStats } from '../hooks/use-voting';
import type { DateRange } from '../types';

interface VoteTimelineProps {
  dateRange?: DateRange;
}

export const VoteTimeline = ({ dateRange }: VoteTimelineProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { data: timelineData, isLoading: isLoadingTimeline, error: timelineError } = useVoteTimeline(dateRange);
  const { data: voteStats } = useVoteStats(dateRange);

  if (isLoadingTimeline) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vote Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading timeline...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (timelineError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vote Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading timeline data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredData = selectedCategory
    ? timelineData?.filter(d => d.categoryId === selectedCategory)
    : timelineData;

  const chartData = filteredData?.map(d => ({
    timestamp: new Date(d.timestamp).toLocaleDateString(),
    votes: d.voteCount,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote Timeline</CardTitle>
        {voteStats && voteStats.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-3 py-1 text-sm rounded-md ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              All Categories
            </button>
            {voteStats.map((stat) => (
              <button
                key={stat.categoryId}
                onClick={() => setSelectedCategory(stat.categoryId)}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedCategory === stat.categoryId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {stat.categoryName}
              </button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No timeline data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="votes" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
