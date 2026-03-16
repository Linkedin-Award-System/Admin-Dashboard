import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendingUp, Users, DollarSign } from 'lucide-react';
import { MetricCard } from './MetricCard';

// Mock the count-up hook to return the final value immediately in tests
vi.mock('../hooks/use-count-up', () => ({
  useCountUp: (end: number) => end,
}));

describe('MetricCard', () => {
  describe('Basic Rendering', () => {
    it('should render metric with title and value', () => {
      render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      expect(screen.getByText('Total Votes')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('should render icon container with correct styling', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      // Icon container should have p-3 (12px padding) and rounded-full (circular shape)
      const iconContainer = container.querySelector('.p-3.rounded-full');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply 20px padding to card content', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      // Card content should have p-5 (20px padding)
      const cardContent = container.querySelector('.p-5');
      expect(cardContent).toBeInTheDocument();
    });

    it('should display value in 30px semibold font', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      // Value should have text-3xl (30px) and font-semibold
      const valueElement = container.querySelector('.text-3xl.font-semibold');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent('1,234');
    });

    it('should display label in 12px uppercase font with increased letter spacing', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      // Label should have text-xs, uppercase, and tracking-wider
      const labelElement = container.querySelector('.text-xs.uppercase.tracking-wider');
      expect(labelElement).toBeInTheDocument();
      expect(labelElement).toHaveTextContent('Total Votes');
    });
  });

  describe('Format Support', () => {
    it('should format currency values correctly', () => {
      render(
        <MetricCard
          title="Total Revenue"
          value={12345.67}
          icon={DollarSign}
          format="currency"
        />
      );

      expect(screen.getByText('$12,345.67')).toBeInTheDocument();
    });

    it('should format percentage values correctly', () => {
      render(
        <MetricCard
          title="Success Rate"
          value={85.5}
          icon={TrendingUp}
          format="percentage"
        />
      );

      expect(screen.getByText('85.50%')).toBeInTheDocument();
    });

    it('should format number values with commas', () => {
      render(
        <MetricCard
          title="Total Votes"
          value={1234567}
          icon={TrendingUp}
          format="number"
        />
      );

      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });

    it('should handle string values', () => {
      render(
        <MetricCard
          title="Status"
          value="Active"
          icon={TrendingUp}
        />
      );

      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    it('should display positive trend indicator with up arrow', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
      );

      expect(screen.getByText('+12.5%')).toBeInTheDocument();
      
      // Should have ArrowUp icon
      const trendContainer = container.querySelector('.rounded-full');
      expect(trendContainer).toBeInTheDocument();
    });

    it('should display negative trend indicator with down arrow', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
          trend={{ value: 5.3, isPositive: false }}
        />
      );

      expect(screen.getByText('5.3%')).toBeInTheDocument();
      
      // Should have trend indicator
      const trendContainer = container.querySelector('.rounded-full');
      expect(trendContainer).toBeInTheDocument();
    });

    it('should render without trend indicator when not provided', () => {
      render(
        <MetricCard
          title="Total Categories"
          value={10}
          icon={Users}
        />
      );

      expect(screen.getByText('Total Categories')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      // Trend indicator should not be present
      expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('should position trend indicator in top-right corner', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
      );

      // Trend should be in a flex container with justify-between
      const flexContainer = container.querySelector('.flex.items-start.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Color Schemes', () => {
    it('should apply blue color scheme', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
          colorScheme="blue"
        />
      );

      // Icon should have LinkedIn Blue background
      const iconContainer = container.querySelector('.bg-\\[\\#0a66c2\\]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply green color scheme', () => {
      const { container } = render(
        <MetricCard
          title="Total Revenue"
          value={12345}
          icon={DollarSign}
          colorScheme="green"
        />
      );

      // Icon should have green background
      const iconContainer = container.querySelector('.bg-\\[\\#10b981\\]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply purple color scheme', () => {
      const { container } = render(
        <MetricCard
          title="Total Nominees"
          value={50}
          icon={Users}
          colorScheme="purple"
        />
      );

      // Icon should have purple background
      const iconContainer = container.querySelector('.bg-\\[\\#a855f7\\]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply orange color scheme', () => {
      const { container } = render(
        <MetricCard
          title="Total Categories"
          value={10}
          icon={Users}
          colorScheme="orange"
        />
      );

      // Icon should have orange background
      const iconContainer = container.querySelector('.bg-\\[\\#f59e0b\\]');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Hover Effects', () => {
    it('should have hover effect with shadow increase', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      // Card should have hover:shadow-lg class
      const card = container.querySelector('.hover\\:shadow-lg');
      expect(card).toBeInTheDocument();
    });

    it('should have 300ms transition duration', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      // Card should have duration-300 class
      const card = container.querySelector('.duration-300');
      expect(card).toBeInTheDocument();
    });

    it('should have icon scale effect on hover', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      // Icon container should have group-hover:scale-110 class
      const iconContainer = container.querySelector('.group-hover\\:scale-110');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label', () => {
      render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
      );

      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', 'Total Votes: 1,234, up +12.5%');
    });

    it('should have proper ARIA label without trend', () => {
      render(
        <MetricCard
          title="Total Categories"
          value={10}
          icon={Users}
        />
      );

      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', 'Total Categories: 10');
    });

    it('should mark decorative elements as aria-hidden', () => {
      const { container } = render(
        <MetricCard
          title="Total Votes"
          value={1234}
          icon={TrendingUp}
        />
      );

      // Background accent should be aria-hidden
      const backgroundAccent = container.querySelector('[aria-hidden="true"]');
      expect(backgroundAccent).toBeInTheDocument();
    });
  });
});
