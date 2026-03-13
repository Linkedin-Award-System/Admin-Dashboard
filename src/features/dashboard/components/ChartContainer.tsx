import type { LucideIcon } from 'lucide-react';
import { type ReactNode, isValidElement } from 'react';
import { cn } from '@/lib/utils';

/**
 * ChartContainer Component
 * 
 * Wrapper component for charts that provides consistent card styling,
 * header with title and icon, and proper spacing for chart content.
 */
export function ChartContainer({
  title,
  description,
  icon: Icon,
  children,
  className,
  isLoading,
  chartHeight = '300px',
}: {
  title: string;
  description?: string;
  icon: LucideIcon | ReactNode;
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
  chartHeight?: string;
}) {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-blue-50 p-2 border border-blue-100" aria-hidden="true">
            {isValidElement(Icon) ? (
              Icon
            ) : typeof Icon === 'function' ? (
              <Icon size={20} className="text-blue-600" />
            ) : null}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {/* Chart content */}
        <div role="img" aria-label={`${title} chart`} className="w-full" style={{ height: chartHeight }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex gap-2 items-end h-12">
                {[4, 8, 6, 10, 5, 8, 4].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-blue-200 rounded-full animate-bounce" 
                    style={{ height: `${h*4}px`, animationDelay: `${i * 100}ms` }} 
                  />
                ))}
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
