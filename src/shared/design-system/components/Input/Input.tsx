/**
 * Design System - Input Component
 * 
 * Enhanced input component with label, error, helper text, and icon support
 * Implements focus states, error states, and smooth transitions
 * 
 * @example
 * ```tsx
 * // Basic input with label
 * <Input label="Email" type="email" placeholder="Enter your email" />
 * 
 * // Input with error
 * <Input label="Password" type="password" error="Password is required" />
 * 
 * // Input with helper text
 * <Input label="Username" helperText="Choose a unique username" />
 * 
 * // Input with left icon
 * <Input label="Search" leftIcon={<Search />} />
 * 
 * // Input with right icon
 * <Input label="Password" type="password" rightIcon={<Eye />} />
 * ```
 */

import * as React from 'react';
import { cn } from '@/shared/design-system/utils/cn';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text displayed above the input
   */
  label?: string;
  
  /**
   * Error message displayed below the input
   */
  error?: string;
  
  /**
   * Helper text displayed below the input (when no error)
   */
  helperText?: string;
  
  /**
   * Icon displayed on the left side of the input
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon displayed on the right side of the input
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Additional CSS classes for the input element
   */
  className?: string;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
}

/**
 * Input component with LinkedIn Blue styling
 * 
 * Features:
 * - Label with 14px medium weight (500) and 8px bottom margin
 * - 12px padding
 * - 8px border radius
 * - 14px font size
 * - Focus state: 2px LinkedIn Blue border
 * - Error state: 2px red border with error message
 * - 200ms transitions
 * - Left and right icon support
 * - Helper text support
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || React.useId();
    const hasError = !!error;
    
    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block mb-2', // 8px bottom margin
              'text-sm font-medium', // 14px medium weight (500)
              'text-gray-900',
              disabled && 'text-gray-400 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
        
        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base styles
              'flex w-full',
              'rounded-lg', // 8px border radius
              'px-3 py-3', // 12px padding
              'text-sm', // 14px font size
              'bg-white',
              'transition-all duration-200', // 200ms transitions
              
              // Border styles
              'border',
              hasError
                ? 'border-2 border-red-500' // Error state: 2px red border
                : 'border-gray-300', // Default: 1px gray border
              
              // Focus styles
              !hasError && [
                'focus:outline-none',
                'focus:border-2 focus:border-primary-600', // Focus state: 2px LinkedIn Blue border
                'focus:ring-0',
              ],
              
              // Error focus styles
              hasError && [
                'focus:outline-none',
                'focus:border-red-500',
                'focus:ring-0',
              ],
              
              // Placeholder styles
              'placeholder:text-gray-400', // Light gray placeholder
              
              // Disabled styles
              'disabled:bg-gray-100',
              'disabled:text-gray-400',
              'disabled:cursor-not-allowed',
              'disabled:opacity-50',
              
              // Icon padding adjustments
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              
              className
            )}
            {...props}
          />
          
          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {/* Error message or helper text */}
        {(error || helperText) && (
          <p
            className={cn(
              'mt-1.5 text-xs', // Small text below input
              error ? 'text-red-500' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
