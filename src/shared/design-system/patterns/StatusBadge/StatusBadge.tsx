/**
 * Design System - StatusBadge Pattern Component
 * 
 * Specialized Badge component for status indicators
 * Maps status values to badge variants automatically
 * 
 * @example
 * ```tsx
 * // Active status
 * <StatusBadge status="active" />
 * 
 * // Pending status
 * <StatusBadge status="pending" />
 * 
 * // Completed status
 * <StatusBadge status="completed" />
 * 
 * // Failed status
 * <StatusBadge status="failed" />
 * 
 * // Inactive status
 * <StatusBadge status="inactive" />
 * 
 * // Custom status with explicit variant
 * <StatusBadge status="processing" variant="info" />
 * 
 * // Small size
 * <StatusBadge status="active" size="sm" />
 * 
 * // Custom label (different from status value)
 * <StatusBadge status="active">Currently Active</StatusBadge>
 * ```
 */

import * as React from 'react';
import { Badge, type BadgeProps } from '@/shared/design-system/components/Badge';

/**
 * Status values that can be automatically mapped to badge variants
 */
export type StatusValue = 
  | 'active' 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'inactive'
  | string; // Allow custom status values

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  /**
   * Status value to display
   * Common values: active, pending, completed, failed, inactive
   */
  status: StatusValue;
  
  /**
   * Optional custom label (if not provided, uses status value)
   */
  children?: React.ReactNode;
  
  /**
   * Optional explicit variant override
   * If not provided, variant is determined by status value
   */
  variant?: BadgeProps['variant'];
}

/**
 * Maps status values to badge variants
 * 
 * Mapping:
 * - active → success (green)
 * - pending → warning (yellow)
 * - completed → success (green)
 * - failed → error (red)
 * - inactive → neutral (gray)
 * - default → neutral (gray)
 * 
 * @param status - Status value to map
 * @returns Badge variant
 */
export function getStatusVariant(status: StatusValue): BadgeProps['variant'] {
  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'completed':
      return 'success';
    case 'failed':
      return 'error';
    case 'inactive':
      return 'neutral';
    default:
      return 'neutral';
  }
}

/**
 * Formats status value for display
 * Capitalizes first letter of each word
 * 
 * @param status - Status value to format
 * @returns Formatted status string
 */
function formatStatus(status: StatusValue): string {
  return status
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * StatusBadge component for status indicators
 * 
 * Features:
 * - Automatic status-to-variant mapping
 * - Supports common status values (active, pending, completed, failed, inactive)
 * - Extensible for custom status values
 * - Inherits all Badge component features (sizes, styling)
 * - Automatic status formatting (capitalizes words)
 * 
 * Status Mappings:
 * - active → success (green #10b981)
 * - pending → warning (yellow #f59e0b)
 * - completed → success (green #10b981)
 * - failed → error (red #ef4444)
 * - inactive → neutral (gray #6b7280)
 * 
 * Validates: Requirements 7.3, 7.7
 */
export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  (
    {
      status,
      children,
      variant,
      size,
      className,
      ...props
    },
    ref
  ) => {
    // Use explicit variant if provided, otherwise map from status
    const badgeVariant = variant ?? getStatusVariant(status);
    
    // Use custom label if provided, otherwise format status value
    const label = children ?? formatStatus(status);
    
    return (
      <Badge
        ref={ref}
        variant={badgeVariant}
        size={size}
        className={className}
        {...props}
      >
        {label}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
