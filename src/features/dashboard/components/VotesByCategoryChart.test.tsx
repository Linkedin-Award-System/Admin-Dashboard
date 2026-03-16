import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VotesByCategoryChart } from './VotesByCategoryChart';
import type { VotesByCategoryData } from '../types';

describe('VotesByCategoryChart', () => {
  const mockData: VotesByCategoryData[] = [
    { category: 'Best Innovation', votes: 150 },
    { category: 'Best Leadership', votes: 120 },
    { category: 'Best Team Player', votes: 95 },
  ];

  it('renders chart with data', () => {
    render(<VotesByCategoryChart data={mockData} />);
    expect(screen.getByText('Votes by Category')).toBeInTheDocument();
  });

  it('displays loading skeleton when isLoading is true', () => {
    render(<VotesByCategoryChart data={[]} isLoading={true} />);
    // Skeleton should be present (check for card structure)
    const cards = document.querySelectorAll('.p-6');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('displays error state when error is provided', () => {
    const error = new Error('Failed to load data');
    render(<VotesByCategoryChart data={[]} error={error} />);
    expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('displays empty state when data is empty', () => {
    render(<VotesByCategoryChart data={[]} />);
    expect(screen.getByText('No category voting data available')).toBeInTheDocument();
  });

  it('displays empty state when data is null', () => {
    render(<VotesByCategoryChart data={null as any} />);
    expect(screen.getByText('No category voting data available')).toBeInTheDocument();
  });
});
