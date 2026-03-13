# Dashboard Feature

## Overview

The Dashboard feature provides a comprehensive analytics interface for the LinkedIn Awards Admin application. It displays key metrics, voting analytics, payment analytics, and nominee statistics through interactive charts and metric cards.

## Components

### MetricCard

Displays a single key performance indicator with visual styling, icon, and optional trend indicator.

**Props:**
- `title` (string): The metric title
- `value` (number | string): The metric value
- `icon` (LucideIcon): Icon component to display
- `trend` (optional): Trend indicator with value and direction
- `format` ('number' | 'currency' | 'percentage'): Value formatting type
- `colorScheme` ('blue' | 'green' | 'purple' | 'orange'): Color theme

**Features:**
- Count-up animation for numeric values
- Responsive design
- Hover effects with elevation
- ARIA labels for accessibility
- Respects prefers-reduced-motion

### Chart Components

All chart components follow a consistent pattern:

#### VotingTrendsChart
Line chart showing vote count over time with smooth curves and gradient fill.

#### VotesByCategoryChart
Bar chart displaying vote distribution across categories.

#### VotingStatusChart
Donut chart showing voting status distribution (active vs completed).

#### RevenueTrendsChart
Area chart displaying revenue trends over time with currency formatting.

#### PaymentStatusChart
Bar chart showing payment status distribution with semantic colors.

#### NomineesByCategoryChart
Bar chart displaying nominee distribution across categories.

#### NomineeStatusChart
Donut chart showing nominee approval status distribution.

**Common Props:**
- `data`: Array of data points specific to each chart type
- `isLoading` (boolean): Loading state
- `error` (Error | null): Error state

**Common Features:**
- Responsive sizing with ResponsiveContainer
- Loading skeletons
- Empty states with helpful messages
- Error states with retry functionality
- Interactive tooltips
- Smooth animations
- ARIA labels for accessibility

### Supporting Components

#### ChartContainer
Wrapper component providing consistent card styling and header for all charts.

#### ChartSkeleton
Loading skeleton with shimmer animation matching chart dimensions.

#### ChartEmpty
Empty state component with icon and message.

#### ChartError
Error state component with error message and retry button.

## Hooks

### useDashboardAnalytics

React Query hooks for fetching dashboard data:

- `useDashboardMetrics()`: Fetches key metrics (votes, revenue, nominees, categories)
- `useVotingTrends(days)`: Fetches voting trends data
- `useVotesByCategory()`: Fetches votes by category data
- `useVotingStatus()`: Fetches voting status distribution
- `useRevenueTrends(days)`: Fetches revenue trends data
- `usePaymentStatus()`: Fetches payment status distribution
- `useNomineesByCategory()`: Fetches nominees by category data
- `useNomineeStatus()`: Fetches nominee status distribution

### useCountUp

Custom hook for animating numeric values with count-up effect.

**Parameters:**
- `end` (number): Target value
- `duration` (number): Animation duration in milliseconds (default: 1000)
- `enabled` (boolean): Whether animation is enabled (default: true)

**Returns:** Current animated value

## Services

### analyticsService

Service layer for dashboard API calls:

- `getMetrics()`: Fetch dashboard metrics
- `getVotingTrends(days)`: Fetch voting trends
- `getVotesByCategory()`: Fetch votes by category
- `getVotingStatus()`: Fetch voting status
- `getRevenueTrends(days)`: Fetch revenue trends
- `getPaymentStatus()`: Fetch payment status
- `getNomineesByCategory()`: Fetch nominees by category
- `getNomineeStatus()`: Fetch nominee status

## Utilities

### format-utils.ts

Formatting utilities for displaying data:

- `formatNumber(value)`: Format number with commas (e.g., 1,234)
- `formatCurrency(value)`: Format as currency (e.g., $1,234.56)
- `formatPercentage(value, includeSign)`: Format as percentage (e.g., 12.5%)
- `formatDate(date)`: Format date for chart labels (e.g., Jan 15)
- `formatFullDate(date)`: Format full date for tooltips (e.g., January 15, 2024)
- `formatTrend(value, isPositive)`: Format trend indicator (e.g., +12.5%)

### chart-config.ts

Centralized Recharts configuration:

- `chartMargins`: Margin configurations for charts
- `chartDimensions`: Height and width settings
- `gridConfig`: Grid line styling
- `axisConfig`: Axis styling
- `tooltipConfig`: Tooltip styling
- `legendConfig`: Legend styling
- `lineChartConfig`: Line chart specific config
- `areaChartConfig`: Area chart specific config
- `barChartConfig`: Bar chart specific config
- `pieChartConfig`: Pie/donut chart specific config
- `animationConfig`: Animation settings
- `chartGradients`: Gradient definitions

## Types

All TypeScript interfaces are defined in `types/index.ts`:

- `MetricCardProps`: Props for MetricCard component
- `DashboardMetrics`: Dashboard metrics data structure
- `VotingTrendData`: Voting trends data point
- `VotesByCategoryData`: Votes by category data point
- `VotingStatusData`: Voting status data point
- `RevenueTrendData`: Revenue trends data point
- `PaymentStatusData`: Payment status data point
- `NomineesByCategoryData`: Nominees by category data point
- `NomineeStatusData`: Nominee status data point

## Styling

The dashboard uses a consistent design system:

### Colors
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Purple: (#8b5cf6)

### Typography
- Metric values: 32px-36px, bold
- Card titles: 18px-20px, semibold
- Body text: 14px-16px
- Captions: 12px-14px

### Spacing
- Base unit: 8px
- Card padding: 24px
- Section spacing: 32px-48px
- Grid gaps: 16px-24px

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Performance Optimizations

1. **React.memo**: All chart components and MetricCard are memoized
2. **React Query Caching**: Data is cached for 30 seconds (metrics) to 1 minute (charts)
3. **Lazy Loading**: Chart components can be lazy loaded if needed
4. **Responsive Container**: Charts automatically resize without re-rendering
5. **Animation Optimization**: Respects prefers-reduced-motion

## Accessibility

- ARIA labels on all charts and metric cards
- Keyboard navigation support
- Focus indicators on interactive elements
- WCAG AA color contrast ratios
- Screen reader friendly
- Semantic HTML structure

## Testing

Tests are located in the same directory as components with `.test.tsx` extension.

### Running Tests

```bash
# Run all dashboard tests
npm test src/features/dashboard

# Run specific test file
npm test src/features/dashboard/components/MetricCard.test.tsx

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

- Unit tests for MetricCard component
- Unit tests for all chart components
- Unit tests for utility functions
- Integration tests for DashboardPage
- Error scenario tests
- Loading state tests
- Empty state tests

## Usage Example

```tsx
import { DashboardPage } from '@/pages/DashboardPage';

// The DashboardPage component handles all data fetching and rendering
function App() {
  return <DashboardPage />;
}
```

## API Integration

The dashboard expects the following API endpoints:

- `GET /api/admin/analytics/metrics` - Dashboard metrics
- `GET /api/admin/analytics/voting-trends?days=30` - Voting trends
- `GET /api/admin/analytics/votes-by-category` - Votes by category
- `GET /api/admin/analytics/voting-status` - Voting status
- `GET /api/admin/analytics/revenue-trends?days=30` - Revenue trends
- `GET /api/admin/analytics/payment-status` - Payment status
- `GET /api/admin/analytics/nominees-by-category` - Nominees by category
- `GET /api/admin/analytics/nominee-status` - Nominee status

## Future Enhancements

- Time range filtering (Last 7 days, Last 30 days, Last 90 days, Custom)
- Export charts as images
- Dark mode support
- Real-time data updates with WebSocket
- Drill-down functionality for charts
- Customizable dashboard layouts
- Additional chart types (scatter, radar, etc.)
