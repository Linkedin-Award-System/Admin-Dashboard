/**
 * Design System - Button Component
 * 
 * Enhanced button component with LinkedIn Blue styling
 * Supports multiple variants, sizes, loading state, and icon support
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary">Click me</Button>
 * 
 * // Secondary button with icon
 * <Button variant="secondary" icon={<Plus />}>Add Item</Button>
 * 
 * // Loading state
 * <Button loading>Saving...</Button>
 * 
 * // Full width button
 * <Button fullWidth>Submit</Button>
 * 
 * // Icon-only button
 * <Button variant="icon" size="sm"><Settings /></Button>
 * ```
 */

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/design-system/utils/cn';
import { buttonVariants, type ButtonVariants } from './Button.variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  /**
   * Show loading spinner and disable button
   */
  loading?: boolean;
  
  /**
   * Icon to display before button text
   */
  icon?: React.ReactNode;
  
  /**
   * Make button full width
   */
  fullWidth?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Button content
   */
  children?: React.ReactNode;
}

/**
 * Button component with LinkedIn Blue styling
 * 
 * Features:
 * - Multiple variants (primary, secondary, danger, ghost, icon)
 * - Three sizes (sm, md, lg)
 * - Loading state with spinner
 * - Icon support
 * - Full width option
 * - Hover effects (shadow increase, scale 1.02)
 * - Active effects (scale 0.98)
 * - 200-300ms transitions
 * - 8px border radius
 * - 12px vertical and 24px horizontal padding (md size)
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      icon,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
