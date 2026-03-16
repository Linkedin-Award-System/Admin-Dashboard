/**
 * Design System - Class Name Utility
 * 
 * Utility function for merging Tailwind CSS class names intelligently
 * Uses tailwind-merge to handle conflicting classes and clsx for conditional classes
 * 
 * @example
 * ```tsx
 * import { cn } from '@/shared/design-system/utils/cn';
 * 
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 * 
 * // Conflicting classes (tailwind-merge handles this)
 * cn('px-4 py-2', 'px-6')
 * // => 'py-2 px-6' (px-6 overrides px-4)
 * 
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class')
 * // => 'base-class active-class' (if isActive is true and isDisabled is false)
 * 
 * // With objects
 * cn('base-class', {
 *   'active-class': isActive,
 *   'disabled-class': isDisabled,
 * })
 * 
 * // Complex example
 * cn(
 *   'rounded-lg px-4 py-2',
 *   variant === 'primary' && 'bg-primary-500 text-white',
 *   variant === 'secondary' && 'bg-white border-2 border-primary-500',
 *   size === 'sm' && 'text-sm',
 *   size === 'lg' && 'text-lg',
 *   disabled && 'opacity-50 cursor-not-allowed'
 * )
 * ```
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names intelligently
 * 
 * Combines clsx for conditional classes and tailwind-merge for handling conflicts
 * 
 * @param inputs - Class names, objects, arrays, or conditional expressions
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
