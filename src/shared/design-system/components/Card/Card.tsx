/**
 * Design System - Card Component
 * 
 * Container component for grouped content with variants and padding options
 * 
 * @example
 * ```tsx
 * // Default card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * 
 * // Elevated card with shadow
 * <Card variant="elevated">
 *   <h3>Elevated Card</h3>
 * </Card>
 * 
 * // Hoverable card
 * <Card hoverable onClick={() => console.log('clicked')}>
 *   <h3>Click me</h3>
 * </Card>
 * 
 * // Card with custom padding
 * <Card padding="lg">
 *   <h3>Large Padding</h3>
 * </Card>
 * 
 * // Card with no padding
 * <Card padding="none">
 *   <img src="..." alt="..." />
 * </Card>
 * ```
 */

import * as React from 'react';
import { cn } from '@/shared/design-system/utils/cn';
import { cardVariants, type CardVariants } from './Card.variants';

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariants {
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Card content
   */
  children?: React.ReactNode;
}

/**
 * Card component with consistent styling
 * 
 * Features:
 * - Multiple variants (default, elevated, outlined)
 * - Padding options (none, sm, md, lg)
 * - 20px default padding (md)
 * - 8px border radius
 * - 1px solid border (#e5e7eb)
 * - Elevated variant with shadow (0 4px 6px rgba(0,0,0,0.07))
 * - Hoverable prop with shadow increase and 300ms transition
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      hoverable,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(cardVariants({ variant, padding, hoverable, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader component for card headers
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component for card titles
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-lg font-medium leading-none tracking-tight', // 18px medium weight (500)
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component for card descriptions
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * CardContent component for card content
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/**
 * CardFooter component for card footers
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants 
};
