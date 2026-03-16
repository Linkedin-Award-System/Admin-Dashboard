import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VotingStatusChart } from './VotingStatusChart';
import type { VotingStatusData } from '../types';

describe('VotingStatusChart', () => {
  const mockData: VotingStatusData[] = [
    { status: 'Active', count: 150, percentage: 60 },
    { status: 'Completed', count: 100, percentage: 40 },
  ];

  it('renders chart with data', () => {
    render(<VotingStatusChart data={mockData} />);
    expect(screen.getByText('Voting Status')).toBeInTheDocument();
  });

  it('displays total votes in center', () => {
    render(<VotingStatusChart data={mockData} />);
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('Total Votes')).toBeInTheDocument();
  });

  it('displays loading skeleton when isLoading is true', () => {
    render(<VotingStatusChart data={[]} isLoading={true} />);
    // Skeleton should be present (check for card structure)
    const cards = document.querySelectorAll('.p-6');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('displays error state when error is provided', () => {
    const error = new Error('Failed to load data');
    render(<VotingStatusChart data={[]} error={error} />);
    expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('displays empty state when data is empty', () => {
    render(<VotingStatusChart data={[]} />);
    expect(screen.getByText('No voting status data available')).toBeInTheDocument();
  });

  it('displays empty state when data is null', () => {
    render(<VotingStatusChart data={null as any} />);
    expect(screen.getByText('No voting status data available')).toBeInTheDocument();
  });
});
