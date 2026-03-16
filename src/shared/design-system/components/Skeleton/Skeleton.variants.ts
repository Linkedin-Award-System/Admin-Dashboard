/**
 * Design System - Skeleton Variants
 * 
 * Skeleton component variants using class-variance-authority
 * Implements loading state placeholders with shimmer animation
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Skeleton variant definitions
 * 
 * Variants:
 * - text: For text content (4px border radius)
 * - circular: For circular elements like avatars (50% border radius)
 * - rectangular: For rectangular content (8px border radius) - default
 * 
 * Animation:
 * - pulse: Simple opacity pulse animation
 * - wave: Shimmer wave animation (default)
 */
export const skeletonVariants = cva(
  // Base styles applied to all skeletons
  [
    'bg-gray-100', // Light gray background (#f3f4f6)
    'relative',
    'overflow-hidden',
  ],
  {
    variants: {
      variant: {
        // Text: For text content (4px border radius)
        text: [
          'rounded-sm', // 4px border radius
          'h-4', // Default height for text
        ],
        
        // Circular: For circular elements (50% border radius)
        circular: [
          'rounded-full', // 50% border radius
          'aspect-square', // Maintain square aspect ratio
        ],
        
        // Rectangular: For rectangular content (8px border radius) - default
        rectangular: [
          'rounded-md', // 8px border radius
        ],
      },
      animation: {
        // Pulse: Simple opacity pulse animation
        pulse: 'animate-pulse',
        
        // Wave: Shimmer wave animation (default)
        wave: [
          'before:absolute',
          'before:inset-0',
          'before:-translate-x-full',
          'before:animate-shimmer',
          'before:bg-gradient-to-r',
          'before:from-transparent',
          'before:via-white/60',
          'before:to-transparent',
        ],
      },
    },
    defaultVariants: {
      variant: 'rectangular',
      animation: 'wave',
    },
  }
);

export type SkeletonVariants = VariantProps<typeof skeletonVariants>;
