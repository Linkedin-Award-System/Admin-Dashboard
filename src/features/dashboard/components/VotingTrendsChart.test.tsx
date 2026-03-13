import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VotingTrendsChart } from './VotingTrendsChart';
import type { VotingTrendData } from '../types';

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('VotingTrendsChart', () => {
  const mockData: VotingTrendData[] = [
    { date: '2024-01-01', votes: 100 },
    { date: '2024-01-02', votes: 150 },
    { date: '2024-01-03', votes: 200 },
  ];

  it('should render chart with data', () => {
    render(<VotingTrendsChart data={mockData} />);

    expect(screen.getByText('Voting Trends')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    render(<VotingTrendsChart data={[]} isLoading={true} />);

    // Should not show the chart title when loading
    expect(screen.queryByText('Voting Trends')).not.toBeInTheDocument();
  });

  it('should show error state when error occurs', () => {
    const error = new Error('Failed to load data');
    render(<VotingTrendsChart data={[]} error={error} />);

    expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    render(<VotingTrendsChart data={[]} />);

    expect(screen.getByText('No voting data available')).toBeInTheDocument();
    expect(screen.getByText('Data will appear here once available')).toBeInTheDocument();
  });

  it('should render chart components when data is provided', () => {
    render(<VotingTrendsChart data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});
