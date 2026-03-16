/**
 * Design System - Badge Component
 * 
 * Status indicator badge with color-coded variants
 * Supports multiple variants and sizes for different use cases
 * 
 * @example
 * ```tsx
 * // Success badge
 * <Badge variant="success">Active</Badge>
 * 
 * // Warning badge
 * <Badge variant="warning">Pending</Badge>
 * 
 * // Error badge
 * <Badge variant="error">Failed</Badge>
 * 
 * // Info badge
 * <Badge variant="info">New</Badge>
 * 
 * // Neutral badge
 * <Badge variant="neutral">Inactive</Badge>
 * 
 * // Small badge
 * <Badge variant="success" size="sm">Active</Badge>
 * ```
 */

import * as React from 'react';
import { cn } from '@/shared/design-system/utils/cn';
import { badgeVariants, type BadgeVariants } from './Badge.variants';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {
  /**
   * Badge content
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Badge component for status indicators
 * 
 * Features:
 * - Multiple color variants (success, warning, error, info, neutral)
 * - Two sizes (sm, md)
 * - Full border radius (9999px)
 * - 4px-12px padding (sm), 6px-16px padding (md)
 * - 12px (sm) or 14px (md) font size
 * - 600 font weight (semibold)
 * - Uppercase text transform
 * - 0.05em letter spacing
 * 
 * Color mappings:
 * - success: #10b981 (green)
 * - warning: #f59e0b (yellow)
 * - error: #ef4444 (red)
 * - info: #0a66c2 (LinkedIn Blue)
 * - neutral: #6b7280 (gray)
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
