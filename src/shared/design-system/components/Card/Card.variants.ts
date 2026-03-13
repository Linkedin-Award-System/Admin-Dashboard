/**
 * Design System - Card Variants
 * 
 * Card component variants using class-variance-authority
 * Implements consistent card styling with elevation and padding options
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Card variant definitions
 * 
 * Variants:
 * - default: Standard card with border
 * - elevated: Card with shadow elevation
 * - outlined: Card with emphasized border
 * 
 * Padding:
 * - none: No padding
 * - sm: Small padding (12px)
 * - md: Medium padding (20px) - default
 * - lg: Large padding (32px)
 */
export const cardVariants = cva(
  // Base styles applied to all cards
  [
    'rounded-lg', // 8px border radius
    'bg-white',
    'transition-shadow duration-300', // 300ms transition for shadow
  ],
  {
    variants: {
      variant: {
        // Default: Standard card with border
        default: [
          'border border-gray-200', // 1px solid border (#e5e7eb)
        ],
        
        // Elevated: Card with shadow elevation
        elevated: [
          'border border-gray-200',
          'shadow-md', // 0 4px 6px rgba(0,0,0,0.07)
        ],
        
        // Outlined: Card with emphasized border
        outlined: [
          'border-2 border-gray-300',
        ],
      },
      padding: {
        // No padding
        none: 'p-0',
        
        // Small padding (12px)
        sm: 'p-3',
        
        // Medium padding (20px) - using p-5 which is 20px in Tailwind
        md: 'p-5',
        
        // Large padding (32px)
        lg: 'p-8',
      },
      hoverable: {
        true: 'cursor-pointer hover:shadow-lg', // Shadow increase on hover
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hoverable: false,
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;
