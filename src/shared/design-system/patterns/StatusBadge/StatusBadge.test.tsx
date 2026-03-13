/**
 * Design System - StatusBadge Component Tests
 * 
 * Unit tests for StatusBadge pattern component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, getStatusVariant } from './StatusBadge';

describe('StatusBadge', () => {
  describe('Status Mapping', () => {
    it('should map "active" status to success variant', () => {
      render(<StatusBadge status="active" />);
      const badge = screen.getByText('Active');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-green-500');
    });

    it('should map "pending" status to warning variant', () => {
      render(<StatusBadge status="pending" />);
      const badge = screen.getByText('Pending');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-yellow-500');
    });

    it('should map "completed" status to success variant', () => {
      render(<StatusBadge status="completed" />);
      const badge = screen.getByText('Completed');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-green-500');
    });

    it('should map "failed" status to error variant', () => {
      render(<StatusBadge status="failed" />);
      const badge = screen.getByText('Failed');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-red-500');
    });

    it('should map "inactive" status to neutral variant', () => {
      render(<StatusBadge status="inactive" />);
      const badge = screen.getByText('Inactive');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-gray-500');
    });

    it('should map unknown status to neutral variant', () => {
      render(<StatusBadge status="unknown-status" />);
      const badge = screen.getByText('Unknown Status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-gray-500');
    });

    it('should be case-insensitive for status mapping', () => {
      render(<StatusBadge status="ACTIVE" />);
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('bg-green-500');
    });
  });

  describe('Status Formatting', () => {
    it('should capitalize status value', () => {
      render(<StatusBadge status="active" />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should format hyphenated status values', () => {
      render(<StatusBadge status="in-progress" />);
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('should format underscore-separated status values', () => {
      render(<StatusBadge status="not_started" />);
      expect(screen.getByText('Not Started')).toBeInTheDocument();
    });

    it('should format space-separated status values', () => {
      render(<StatusBadge status="on hold" />);
      expect(screen.getByText('On Hold')).toBeInTheDocument();
    });
  });

  describe('Custom Label', () => {
    it('should use custom label when provided', () => {
      render(<StatusBadge status="active">Currently Active</StatusBadge>);
      expect(screen.getByText('Currently Active')).toBeInTheDocument();
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });

    it('should still map variant correctly with custom label', () => {
      render(<StatusBadge status="failed">Error Occurred</StatusBadge>);
      const badge = screen.getByText('Error Occurred');
      expect(badge).toHaveClass('bg-red-500');
    });
  });

  describe('Variant Override', () => {
    it('should use explicit variant when provided', () => {
      render(<StatusBadge status="custom" variant="info" />);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('bg-primary-600');
    });

    it('should override automatic mapping with explicit variant', () => {
      render(<StatusBadge status="active" variant="error" />);
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('bg-red-500');
    });
  });

  describe('Size Prop', () => {
    it('should support small size', () => {
      render(<StatusBadge status="active" size="sm" />);
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('text-xs');
    });

    it('should support medium size (default)', () => {
      render(<StatusBadge status="active" size="md" />);
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('text-sm');
    });
  });

  describe('Additional Props', () => {
    it('should pass through className prop', () => {
      render(<StatusBadge status="active" className="custom-class" />);
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('custom-class');
    });

    it('should pass through data attributes', () => {
      render(<StatusBadge status="active" data-testid="status-badge" />);
      expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    });
  });

  describe('Badge Styling', () => {
    it('should have uppercase text transform', () => {
      render(<StatusBadge status="active" />);
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('uppercase');
    });

    it('should have full border radius', () => {
      render(<StatusBadge status="active" />);
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have semibold font weight', () => {
      render(<StatusBadge status="active" />);
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('font-semibold');
    });
  });
});

describe('getStatusVariant', () => {
  it('should return "success" for "active"', () => {
    expect(getStatusVariant('active')).toBe('success');
  });

  it('should return "warning" for "pending"', () => {
    expect(getStatusVariant('pending')).toBe('warning');
  });

  it('should return "success" for "completed"', () => {
    expect(getStatusVariant('completed')).toBe('success');
  });

  it('should return "error" for "failed"', () => {
    expect(getStatusVariant('failed')).toBe('error');
  });

  it('should return "neutral" for "inactive"', () => {
    expect(getStatusVariant('inactive')).toBe('neutral');
  });

  it('should return "neutral" for unknown status', () => {
    expect(getStatusVariant('unknown')).toBe('neutral');
  });

  it('should be case-insensitive', () => {
    expect(getStatusVariant('ACTIVE')).toBe('success');
    expect(getStatusVariant('Pending')).toBe('warning');
    expect(getStatusVariant('FAILED')).toBe('error');
  });
});
