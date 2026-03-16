/**
 * Design System - Skeleton Component
 * 
 * Loading state placeholder with shimmer animation
 * Supports multiple variants and animation types
 * 
 * @example
 * ```tsx
 * // Text skeleton
 * <Skeleton variant="text" width="200px" />
 * 
 * // Circular skeleton (avatar)
 * <Skeleton variant="circular" width="48px" height="48px" />
 * 
 * // Rectangular skeleton (card)
 * <Skeleton variant="rectangular" width="100%" height="200px" />
 * 
 * // Pulse animation
 * <Skeleton animation="pulse" width="100%" height="100px" />
 * 
 * // Custom dimensions
 * <Skeleton width={300} height={150} />
 * ```
 */

import * as React from 'react';
import { cn } from '@/shared/design-system/utils/cn';
import { skeletonVariants, type SkeletonVariants } from './Skeleton.variants';

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    SkeletonVariants {
  /**
   * Width of the skeleton
   * Can be a string (e.g., "100%", "200px") or number (pixels)
   */
  width?: string | number;
  
  /**
   * Height of the skeleton
   * Can be a string (e.g., "100%", "200px") or number (pixels)
   */
  height?: string | number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Skeleton component for loading states
 * 
 * Features:
 * - Multiple variants (text, circular, rectangular)
 * - Two animation types (pulse, wave)
 * - Light gray background (#f3f4f6)
 * - Border radius: 8px (rectangular), 50% (circular), 4px (text)
 * - Shimmer animation with 1.5s duration
 * - Custom width and height props
 * 
 * Styling Details:
 * - Background: #f3f4f6 (gray-100)
 * - Border radius: 8px (rectangular), 50% (circular), 4px (text)
 * - Animation: Shimmer effect with 1.5s duration (wave)
 * - Gradient: Linear gradient for wave animation
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, animation, width, height, style, ...props }, ref) => {
    // Convert numeric width/height to pixel strings
    const dimensionStyle: React.CSSProperties = {
      ...(width !== undefined && {
        width: typeof width === 'number' ? `${width}px` : width,
      }),
      ...(height !== undefined && {
        height: typeof height === 'number' ? `${height}px` : height,
      }),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, animation, className }))}
        style={dimensionStyle}
        aria-busy="true"
        aria-live="polite"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton, skeletonVariants };
