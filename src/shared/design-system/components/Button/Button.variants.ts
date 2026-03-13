/**
 * Design System - Button Variants
 * 
 * Button component variants using class-variance-authority
 * Implements LinkedIn Blue styling with multiple variants and sizes
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button variant definitions
 * 
 * Variants:
 * - primary: LinkedIn Blue background, white text, shadow
 * - secondary: White background, LinkedIn Blue border and text
 * - danger: Red background, white text, for destructive actions
 * - ghost: Transparent background, minimal styling
 * - icon: Square button for icon-only actions
 * 
 * Sizes:
 * - sm: Small button (9px height, 16px horizontal padding)
 * - md: Medium button (12px vertical, 24px horizontal padding) - default
 * - lg: Large button (14px height, 32px horizontal padding)
 */
export const buttonVariants = cva(
  // Base styles applied to all buttons
  [
    'inline-flex items-center justify-center',
    'rounded-lg', // 8px border radius
    'font-medium',
    'transition-all duration-300', // 200-300ms transitions
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]', // Active effect: scale down
  ],
  {
    variants: {
      variant: {
        // Primary: LinkedIn Blue background, white text
        primary: [
          'bg-primary-600 text-white',
          'hover:bg-primary-700',
          'active:bg-primary-800',
          'hover:shadow-lg hover:scale-[1.02]', // Hover: shadow increase, scale 1.02
          'shadow-md',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        ],
        
        // Secondary: White background, LinkedIn Blue border and text
        secondary: [
          'bg-white text-primary-600',
          'border-2 border-primary-600',
          'hover:bg-primary-50',
          'active:bg-primary-100',
          'hover:shadow-md hover:scale-[1.02]',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        ],
        
        // Danger: Red background, white text
        danger: [
          'bg-red-600 text-white',
          'hover:bg-red-700',
          'active:bg-red-800',
          'hover:shadow-lg hover:scale-[1.02]',
          'shadow-md',
          'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
        ],
        
        // Ghost: Transparent background, minimal styling
        ghost: [
          'bg-transparent text-gray-700',
          'hover:bg-gray-100',
          'active:bg-gray-200',
          'hover:scale-[1.02]',
          'focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2',
        ],
        
        // Icon: Square button for icon-only actions
        icon: [
          'bg-transparent text-gray-700',
          'hover:bg-gray-100',
          'active:bg-gray-200',
          'hover:scale-[1.02]',
          'focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2',
        ],
      },
      size: {
        // Small: 9px height, 16px horizontal padding
        sm: 'h-9 px-4 text-sm',
        
        // Medium: 12px vertical, 24px horizontal padding (default)
        md: 'h-12 px-6 py-3',
        
        // Large: 14px height, 32px horizontal padding
        lg: 'h-14 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    // Compound variants for special combinations
    compoundVariants: [
      {
        variant: 'icon',
        size: 'sm',
        class: 'h-9 w-9 px-0',
      },
      {
        variant: 'icon',
        size: 'md',
        class: 'h-12 w-12 px-0',
      },
      {
        variant: 'icon',
        size: 'lg',
        class: 'h-14 w-14 px-0',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
