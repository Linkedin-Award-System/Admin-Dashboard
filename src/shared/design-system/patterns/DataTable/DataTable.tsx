/**
 * Design System - DataTable Pattern Component
 * 
 * Professional table styling with columns, data, loading, and interactive features
 * Supports sorting, row hover, zebra striping, and status badges
 * 
 * @example
 * ```tsx
 * // Basic table
 * <DataTable
 *   columns={[
 *     { key: 'name', label: 'Name' },
 *     { key: 'email', label: 'Email' },
 *     { key: 'status', label: 'Status' }
 *   ]}
 *   data={[
 *     { name: 'John Doe', email: 'john@example.com', status: 'active' },
 *     { name: 'Jane Smith', email: 'jane@example.com', status: 'pending' }
 *   ]}
 * />
 * 
 * // With custom rendering and alignment
 * <DataTable
 *   columns={[
 *     { key: 'name', label: 'Name', align: 'left' },
 *     { key: 'amount', label: 'Amount', align: 'right', render: (value) => `$${value}` },
 *     { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }
 *   ]}
 *   data={data}
 * />
 * 
 * // With loading state
 * <DataTable
 *   columns={columns}
 *   data={[]}
 *   loading={true}
 * />
 * 
 * // With empty message
 * <DataTable
 *   columns={columns}
 *   data={[]}
 *   emptyMessage="No records found"
 * />
 * 
 * // With row click handler
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   onRowClick={(row) => console.log('Clicked row:', row)}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/shared/design-system/utils/cn';
import { Skeleton } from '@/shared/design-system/components/Skeleton';

/**
 * Column definition for DataTable
 */
export interface DataTableColumn<T = any> {
  /**
   * Unique key for the column (matches data object key)
   */
  key: string;
  
  /**
   * Column header label
   */
  label: string;
  
  /**
   * Text alignment for the column
   * - left: Text columns (default)
   * - right: Numeric columns
   * - center: Centered content
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Custom render function for cell content
   * If not provided, displays the raw value
   */
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Column definitions
   */
  columns: DataTableColumn<T>[];
  
  /**
   * Data array of objects
   */
  data: T[];
  
  /**
   * Loading state - displays skeleton rows
   */
  loading?: boolean;
  
  /**
   * Message to display when data is empty
   * Default: "No data available"
   */
  emptyMessage?: string;
  
  /**
   * Row click handler for interactive tables
   */
  onRowClick?: (row: T) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * DataTable component with professional styling
 * 
 * Features:
 * - Column configuration (label, accessor, align, render)
 * - Data array of objects
 * - Loading state with Skeleton components
 * - Empty state with custom message
 * - Row click handler for interactive tables
 * - Zebra striping for better readability
 * - Hover effects for interactive feedback
 * - Responsive behavior
 * 
 * Styling Details:
 * - Headers: 12px uppercase medium weight (500) text (#6b7280)
 * - Cell padding: 12px
 * - Borders: 1px solid (#e5e7eb)
 * - Row hover: Background color change (#f9fafb)
 * - Zebra striping: Alternate row backgrounds
 * - Numeric alignment: Right-aligned
 * - Text alignment: Left-aligned
 * 
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8
 */
export function DataTable<T = any>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className,
  ...props
}: DataTableProps<T>) {
  // Determine if rows are clickable
  const isClickable = !!onRowClick;
  
  return (
    <div
      className={cn('w-full overflow-x-auto', className)}
      {...props}
    >
      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  // 12px uppercase medium weight (500) text (#6b7280) - Requirement 7.1
                  'text-xs font-medium uppercase tracking-wider text-gray-500',
                  // 12px cell padding - Requirement 7.4
                  'px-3 py-3',
                  // Alignment
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  column.align === 'left' && 'text-left',
                  !column.align && 'text-left' // Default to left
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {/* Loading State */}
          {loading && (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={`skeleton-${index}`}
                  className="border-b border-gray-200"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 py-3"
                    >
                      <Skeleton variant="text" width="100%" height="20px" />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}

          {/* Empty State */}
          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-8 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {/* Data Rows */}
          {!loading && data.length > 0 && data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                // 1px solid borders (#e5e7eb) - Requirement 7.5
                'border-b border-gray-200',
                // Zebra striping - Requirement 7.6
                rowIndex % 2 === 1 && 'bg-gray-50',
                // Row hover with background color change (#f9fafb) - Requirement 7.2
                'hover:bg-gray-50 transition-colors',
                // Clickable cursor
                isClickable && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => {
                const value = (row as any)[column.key];
                const content = column.render ? column.render(value, row) : value;
                
                return (
                  <td
                    key={column.key}
                    className={cn(
                      // 12px cell padding - Requirement 7.4
                      'px-3 py-3',
                      // Text styling
                      'text-sm text-gray-900',
                      // Align numeric columns right, text columns left - Requirement 7.7
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      column.align === 'left' && 'text-left',
                      !column.align && 'text-left' // Default to left
                    )}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataTable.displayName = 'DataTable';
