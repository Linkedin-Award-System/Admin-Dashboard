# Voting Monitoring Module

This module provides real-time voting statistics and analytics for the LinkedIn Awards Admin Dashboard.

## Features

- **Real-time Updates**: Automatic polling every 30 seconds for live vote data
- **Vote Statistics**: Display total votes, unique voters, and leading nominees
- **Category Breakdown**: Detailed vote counts and percentages per category
- **Timeline Visualization**: Interactive chart showing vote accumulation over time
- **Date Range Filtering**: Filter statistics by custom date ranges
- **URL State Management**: Filter state persisted in URL query parameters

## Components

### VotingDashboard
Main dashboard displaying key metrics:
- Total votes across all categories
- Unique voter count
- Number of active categories
- Leading nominees per category

### CategoryVoteStats
Detailed breakdown of votes per category:
- Total votes per category
- Leading nominee information
- All nominees with vote counts and percentages
- Visual progress bars for vote distribution

### VoteTimeline
Interactive timeline chart:
- Vote accumulation over time
- Category filtering
- Monotonically increasing vote counts
- Built with Recharts

### DateRangeFilter
Date range selection component:
- Start and end date pickers
- Apply/clear filter actions
- URL query parameter integration
- Automatic filter application

## Data Models

### VoteStats
```typescript
interface VoteStats {
  categoryId: string;
  categoryName: string;
  totalVotes: number;
  nominees: NomineeVoteData[];
  leadingNominee: {
    id: string;
    name: string;
    voteCount: number;
  };
}
```

### NomineeVoteData
```typescript
interface NomineeVoteData {
  nomineeId: string;
  nomineeName: string;
  voteCount: number;
  percentage: number;
}
```

### VoteTimelineData
```typescript
interface VoteTimelineData {
  timestamp: string;
  voteCount: number;
  categoryId?: string;
}
```

## Services

### votingService
API service for fetching voting data:
- `getStats(dateRange?)`: Fetch vote statistics
- `getTimeline(dateRange?)`: Fetch timeline data
- `getUniqueVoterCount()`: Fetch unique voter count

## Hooks

### useVoteStats
React Query hook for vote statistics with 30-second polling:
```typescript
const { data, isLoading, error } = useVoteStats(dateRange);
```

### useVoteTimeline
React Query hook for timeline data with 30-second polling:
```typescript
const { data, isLoading, error } = useVoteTimeline(dateRange);
```

### useUniqueVoterCount
React Query hook for unique voter count with 30-second polling:
```typescript
const { data, isLoading, error } = useUniqueVoterCount();
```

## Usage Example

```typescript
import { VotingPage } from '@/pages/VotingPage';

// In your router configuration
<Route path="/voting" element={<VotingPage />} />
```

## Requirements Validation

This module validates the following requirements:
- **4.1**: Display vote stats for each category
- **4.2**: Display vote stats for each nominee with percentages
- **4.3**: Auto-refresh within 30 seconds
- **4.4**: Timeline chart showing vote accumulation
- **4.7**: Display unique voter count
- **4.8**: Date range filtering support

## API Endpoints

- `GET /votes/stats?startDate=&endDate=`: Fetch vote statistics
- `GET /votes/timeline?startDate=&endDate=`: Fetch timeline data
- `GET /votes/unique-voters`: Fetch unique voter count
