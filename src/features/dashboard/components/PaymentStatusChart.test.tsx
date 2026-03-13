import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentStatusChart } from './PaymentStatusChart';
import type { PaymentStatusData } from '../types';

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar">{children}</div>
  ),
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('PaymentStatusChart', () => {
  const mockData: PaymentStatusData[] = [
    { status: 'completed', count: 100 },
    { status: 'pending', count: 50 },
    { status: 'failed', count: 10 },
  ];

  it('should render chart with data', () => {
    render(<PaymentStatusChart data={mockData} />);

    expect(screen.getByText('Payment Status')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    render(<PaymentStatusChart data={[]} isLoading={true} />);

    // Should not show the chart title when loading
    expect(screen.queryByText('Payment Status')).not.toBeInTheDocument();
  });

  it('should show error state when error occurs', () => {
    const error = new Error('Failed to load payment data');
    render(<PaymentStatusChart data={[]} error={error} />);

    expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    expect(screen.getByText('Failed to load payment data')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    render(<PaymentStatusChart data={[]} />);

    expect(screen.getByText('No payment data available')).toBeInTheDocument();
    expect(screen.getByText('Data will appear here once available')).toBeInTheDocument();
  });

  it('should render chart components when data is provided', () => {
    render(<PaymentStatusChart data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});
