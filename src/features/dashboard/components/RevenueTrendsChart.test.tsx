import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevenueTrendsChart } from './RevenueTrendsChart';
import type { RevenueTrendData } from '../types';

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('RevenueTrendsChart', () => {
  const mockData: RevenueTrendData[] = [
    { date: '2024-01-01', revenue: 1000 },
    { date: '2024-01-02', revenue: 1500 },
    { date: '2024-01-03', revenue: 2000 },
  ];

  it('should render chart with data', () => {
    render(<RevenueTrendsChart data={mockData} />);

    expect(screen.getByText('Revenue Trends')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    render(<RevenueTrendsChart data={[]} isLoading={true} />);

    // Should not show the chart title when loading
    expect(screen.queryByText('Revenue Trends')).not.toBeInTheDocument();
  });

  it('should show error state when error occurs', () => {
    const error = new Error('Failed to load revenue data');
    render(<RevenueTrendsChart data={[]} error={error} />);

    expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    expect(screen.getByText('Failed to load revenue data')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    render(<RevenueTrendsChart data={[]} />);

    expect(screen.getByText('No revenue data available')).toBeInTheDocument();
    expect(screen.getByText('Data will appear here once available')).toBeInTheDocument();
  });

  it('should render chart components when data is provided', () => {
    render(<RevenueTrendsChart data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});
