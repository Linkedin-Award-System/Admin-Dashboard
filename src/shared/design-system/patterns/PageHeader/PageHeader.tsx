/**
 * Design System - PageHeader Pattern Component
 * 
 * Consistent page header styling across all pages
 * Supports title, subtitle, actions, and breadcrumbs
 * 
 * @example
 * ```tsx
 * // Basic page header
 * <PageHeader title="Dashboard" />
 * 
 * // With subtitle
 * <PageHeader 
 *   title="Dashboard" 
 *   subtitle="View key metrics and analytics"
 * />
 * 
 * // With actions
 * <PageHeader 
 *   title="Categories" 
 *   actions={<Button>Create Category</Button>}
 * />
 * 
 * // With breadcrumbs
 * <PageHeader 
 *   title="Edit Category"
 *   breadcrumbs={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Categories', href: '/categories' },
 *     { label: 'Edit' }
 *   ]}
 * />
 * 
 * // Complete example
 * <PageHeader 
 *   title="Nominees"
 *   subtitle="Manage award nominees"
 *   actions={
 *     <div className="flex gap-2">
 *       <Button variant="secondary">Export</Button>
 *       <Button>Add Nominee</Button>
 *     </div>
 *   }
 *   breadcrumbs={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Nominees' }
 *   ]}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/shared/design-system/utils/cn';

export interface Breadcrumb {
  /**
   * Breadcrumb label text
   */
  label: string;
  
  /**
   * Optional link href (if not provided, renders as plain text)
   */
  href?: string;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Page title (required)
   * Styled with 24px semibold font (#111827)
   */
  title: string;
  
  /**
   * Optional subtitle
   * Styled with 14px regular font (#6b7280) and 8px top margin
   */
  subtitle?: string;
  
  /**
   * Optional action buttons
   * Aligned to right on desktop, stack below title on mobile (< 640px)
   */
  actions?: React.ReactNode;
  
  /**
   * Optional breadcrumbs navigation
   */
  breadcrumbs?: Breadcrumb[];
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * PageHeader component with consistent styling
 * 
 * Features:
 * - Title: 24px semibold, #111827
 * - Subtitle: 14px regular, #6b7280, 8px top margin
 * - Actions: Aligned to right on desktop, below title on mobile
 * - 32px bottom margin
 * - Responsive: Stack vertically on mobile (< 640px)
 * 
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */
export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      subtitle,
      actions,
      breadcrumbs,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-8', // 32px bottom margin (Requirement 5.4)
          className
        )}
        {...props}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-gray-400">/</span>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header content: Title/Subtitle and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Title and Subtitle */}
          <div className="flex-1">
            <h1 
              className={cn(
                'text-2xl font-semibold text-gray-900', // 24px semibold, #111827 (Requirement 5.1)
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p 
                className={cn(
                  'mt-2 text-sm text-gray-500', // 14px regular, #6b7280, 8px top margin (Requirement 5.2, 5.5)
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions - Aligned right on desktop, below title on mobile (Requirement 5.3, 5.6) */}
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';
