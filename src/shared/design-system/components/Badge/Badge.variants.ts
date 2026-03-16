/**
 * Design System - Badge Variants
 * 
 * Badge component variants using class-variance-authority
 * Implements color-coded status indicators with multiple variants and sizes
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Badge variant definitions
 * 
 * Variants:
 * - success: Green background (#10b981)
 * - warning: Yellow background (#f59e0b)
 * - error: Red background (#ef4444)
 * - info: Blue background (#0a66c2)
 * - neutral: Gray background (#6b7280)
 * 
 * Sizes:
 * - sm: Small badge (4px-12px padding, 12px font)
 * - md: Medium badge (6px-16px padding, 14px font) - default
 */
export const badgeVariants = cva(
  // Base styles applied to all badges
  [
    'inline-flex items-center justify-center',
    'rounded-full', // Full border radius (9999px)
    'font-semibold', // 600 weight
    'uppercase', // Uppercase transform
    'tracking-wider', // 0.05em letter spacing
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        // Success: Green background
        success: [
          'bg-green-500 text-white',
        ],
        
        // Warning: Yellow background
        warning: [
          'bg-yellow-500 text-white',
        ],
        
        // Error: Red background
        error: [
          'bg-red-500 text-white',
        ],
        
        // Info: Blue background (LinkedIn Blue)
        info: [
          'bg-primary-600 text-white',
        ],
        
        // Neutral: Gray background
        neutral: [
          'bg-gray-500 text-white',
        ],
      },
      size: {
        // Small: 4px-12px padding, 12px font
        sm: 'px-3 py-1 text-xs',
        
        // Medium: 6px-16px padding, 14px font (default)
        md: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
