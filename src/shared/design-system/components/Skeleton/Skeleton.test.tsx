/**
 * Skeleton Component Tests
 * 
 * Unit tests for the Skeleton component
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have aria-busy attribute', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
    });

    it('should have aria-live attribute', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Variants', () => {
    it('should render text variant with correct classes', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-sm');
    });

    it('should render circular variant with correct classes', () => {
      const { container } = render(<Skeleton variant="circular" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-full');
      expect(skeleton).toHaveClass('aspect-square');
    });

    it('should render rectangular variant with correct classes (default)', () => {
      const { container } = render(<Skeleton variant="rectangular" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-md');
    });

    it('should use rectangular variant by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-md');
    });
  });

  describe('Animation', () => {
    it('should render wave animation by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('before:animate-shimmer');
    });

    it('should render pulse animation when specified', () => {
      const { container } = render(<Skeleton animation="pulse" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should render wave animation when specified', () => {
      const { container } = render(<Skeleton animation="wave" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('before:animate-shimmer');
    });
  });

  describe('Dimensions', () => {
    it('should apply width as string', () => {
      const { container } = render(<Skeleton width="200px" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('should apply height as string', () => {
      const { container } = render(<Skeleton height="100px" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ height: '100px' });
    });

    it('should apply width as number (pixels)', () => {
      const { container } = render(<Skeleton width={300} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '300px' });
    });

    it('should apply height as number (pixels)', () => {
      const { container } = render(<Skeleton height={150} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ height: '150px' });
    });

    it('should apply both width and height', () => {
      const { container } = render(<Skeleton width="100%" height="200px" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '100%', height: '200px' });
    });

    it('should apply percentage width', () => {
      const { container } = render(<Skeleton width="50%" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '50%' });
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('custom-class');
    });

    it('should merge custom className with variant classes', () => {
      const { container } = render(
        <Skeleton variant="circular" className="custom-class" />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('custom-class');
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('should apply custom style prop', () => {
      const { container } = render(
        <Skeleton style={{ backgroundColor: 'red' }} />
      );
      const skeleton = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(skeleton);
      // Check that style attribute is set
      expect(skeleton.style.backgroundColor).toBe('red');
    });

    it('should merge custom style with dimension styles', () => {
      const { container } = render(
        <Skeleton width="100px" style={{ backgroundColor: 'red' }} />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.width).toBe('100px');
      expect(skeleton.style.backgroundColor).toBe('red');
    });
  });

  describe('Base Styles', () => {
    it('should have light gray background', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('bg-gray-100');
    });

    it('should have relative positioning', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('relative');
    });

    it('should have overflow hidden', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('overflow-hidden');
    });
  });

  describe('Variant Combinations', () => {
    it('should render text variant with pulse animation', () => {
      const { container } = render(
        <Skeleton variant="text" animation="pulse" />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-sm');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should render circular variant with wave animation', () => {
      const { container } = render(
        <Skeleton variant="circular" animation="wave" />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-full');
      expect(skeleton).toHaveClass('before:animate-shimmer');
    });

    it('should render rectangular variant with custom dimensions', () => {
      const { container } = render(
        <Skeleton variant="rectangular" width="100%" height="200px" />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-md');
      expect(skeleton).toHaveStyle({ width: '100%', height: '200px' });
    });
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
    });

    it('should accept additional ARIA attributes', () => {
      const { container } = render(
        <Skeleton aria-label="Loading content" />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero width', () => {
      const { container } = render(<Skeleton width={0} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '0px' });
    });

    it('should handle zero height', () => {
      const { container } = render(<Skeleton height={0} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ height: '0px' });
    });

    it('should handle very large dimensions', () => {
      const { container } = render(<Skeleton width={10000} height={5000} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '10000px', height: '5000px' });
    });

    it('should not apply width/height styles when undefined', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      // When width/height are undefined, they should not be in the style attribute
      expect(skeleton.style.width).toBe('');
      expect(skeleton.style.height).toBe('');
    });
  });
});
