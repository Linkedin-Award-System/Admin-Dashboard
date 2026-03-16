/**
 * Design System - Badge Component Tests
 * 
 * Unit tests for the Badge component
 * Tests basic rendering, variants, sizes, and styling
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('Basic Rendering', () => {
    it('should render badge with children', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('custom-class');
    });

    it('should forward ref to div element', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Badge ref={ref}>Badge</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('should render neutral variant by default', () => {
      render(<Badge>Neutral</Badge>);
      const badge = screen.getByText('Neutral');
      expect(badge).toHaveClass('bg-gray-500');
    });

    it('should render success variant with green background', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-green-500', 'text-white');
    });

    it('should render warning variant with yellow background', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-yellow-500', 'text-white');
    });

    it('should render error variant with red background', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-red-500', 'text-white');
    });

    it('should render info variant with blue background', () => {
      render(<Badge variant="info">Info</Badge>);
      const badge = screen.getByText('Info');
      expect(badge).toHaveClass('bg-primary-600', 'text-white');
    });

    it('should render neutral variant with gray background', () => {
      render(<Badge variant="neutral">Neutral</Badge>);
      const badge = screen.getByText('Neutral');
      expect(badge).toHaveClass('bg-gray-500', 'text-white');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Badge>Medium</Badge>);
      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-4', 'py-1.5', 'text-sm');
    });

    it('should render small size', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-3', 'py-1', 'text-xs');
    });

    it('should render medium size explicitly', () => {
      render(<Badge size="md">Medium</Badge>);
      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-4', 'py-1.5', 'text-sm');
    });
  });

  describe('Styling', () => {
    it('should have full border radius', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have semibold font weight', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('font-semibold');
    });

    it('should have uppercase text transform', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('uppercase');
    });

    it('should have increased letter spacing', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('tracking-wider');
    });

    it('should prevent text wrapping', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('whitespace-nowrap');
    });

    it('should be inline-flex', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });
  });

  describe('Variant and Size Combinations', () => {
    it('should render success badge with small size', () => {
      render(<Badge variant="success" size="sm">Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-green-500', 'px-3', 'py-1', 'text-xs');
    });

    it('should render warning badge with medium size', () => {
      render(<Badge variant="warning" size="md">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-yellow-500', 'px-4', 'py-1.5', 'text-sm');
    });

    it('should render error badge with small size', () => {
      render(<Badge variant="error" size="sm">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-red-500', 'px-3', 'py-1', 'text-xs');
    });

    it('should render info badge with medium size', () => {
      render(<Badge variant="info" size="md">Info</Badge>);
      const badge = screen.getByText('Info');
      expect(badge).toHaveClass('bg-primary-600', 'px-4', 'py-1.5', 'text-sm');
    });
  });

  describe('Content', () => {
    it('should render text content', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render with React nodes as children', () => {
      render(
        <Badge>
          <span data-testid="icon">✓</span>
          <span>Success</span>
        </Badge>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should render with numbers', () => {
      render(<Badge>{42}</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('should accept and apply data attributes', () => {
      render(<Badge data-testid="custom-badge">Badge</Badge>);
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
    });

    it('should accept and apply aria attributes', () => {
      render(<Badge aria-label="Status badge">Active</Badge>);
      const badge = screen.getByLabelText('Status badge');
      expect(badge).toBeInTheDocument();
    });

    it('should accept and apply role attribute', () => {
      render(<Badge role="status">Active</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Color Mappings', () => {
    it('should use correct color for success (#10b981)', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      // bg-green-500 maps to #10b981
      expect(badge).toHaveClass('bg-green-500');
    });

    it('should use correct color for warning (#f59e0b)', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      // bg-yellow-500 maps to #f59e0b
      expect(badge).toHaveClass('bg-yellow-500');
    });

    it('should use correct color for error (#ef4444)', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      // bg-red-500 maps to #ef4444
      expect(badge).toHaveClass('bg-red-500');
    });

    it('should use correct color for info (#0a66c2)', () => {
      render(<Badge variant="info">Info</Badge>);
      const badge = screen.getByText('Info');
      // bg-primary-600 maps to #0a66c2 (LinkedIn Blue)
      expect(badge).toHaveClass('bg-primary-600');
    });

    it('should use correct color for neutral (#6b7280)', () => {
      render(<Badge variant="neutral">Neutral</Badge>);
      const badge = screen.getByText('Neutral');
      // bg-gray-500 maps to #6b7280
      expect(badge).toHaveClass('bg-gray-500');
    });
  });
});
