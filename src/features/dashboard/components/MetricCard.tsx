import { memo } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/lib/utils';
import type { MetricCardProps } from '../types';
import { formatNumber, formatCurrency, formatPercentage, formatTrend } from '../utils/format-utils';
import { useCountUp } from '../hooks/use-count-up';

/**
 * MetricCard Component
 * 
 * Displays a single key metric with visual styling, icon, and optional trend indicator.
 * Enhanced with design system tokens for consistent styling.
 * 
 * Design Requirements:
 * - 20px padding (p-5 = 20px)
 * - 30px semibold font for value (text-3xl font-semibold)
 * - 12px uppercase font for label with increased letter spacing (text-xs uppercase tracking-wider)
 * - Icon container with 12px padding (p-3 = 12px) and circular shape (rounded-full)
 * - Color schemes: blue, green, purple, orange for icon backgrounds
 * - Trend indicator with up/down arrow icons in top-right corner
 * - Hover effect with shadow increase and 300ms transition
 * - Support format prop: number, currency, percentage
 */
export const MetricCard = memo(function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  format = 'number',
  colorScheme = 'blue',
}: MetricCardProps) {
  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  // Animate numeric values
  const numericValue = typeof value === 'number' ? value : 0;
  const animatedValue = useCountUp(numericValue, 1500, !prefersReducedMotion && typeof value === 'number');
  
  // Format display value
  const displayValue = typeof value === 'string' ? value : animatedValue;
  const formattedValue = typeof value === 'string' 
    ? value 
    : format === 'currency'
    ? formatCurrency(displayValue as number)
    : format === 'percentage'
    ? formatPercentage(displayValue as number, false)
    : formatNumber(displayValue as number);

  // Map color schemes to design system tokens
  // Using design system colors for consistency
  const colorSchemes = {
    blue: {
      icon: 'bg-[#0a66c2] text-white', // LinkedIn Blue (primary-500)
      iconHover: 'group-hover:bg-[#085299]', // primary-600
      trend: trend?.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
      ghost: 'bg-blue-500/5',
    },
    green: {
      icon: 'bg-[#10b981] text-white', // Success green (success-500)
      iconHover: 'group-hover:bg-[#059669]', // success-600
      trend: trend?.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
      ghost: 'bg-emerald-500/5',
    },
    purple: {
      icon: 'bg-[#a855f7] text-white', // Purple (purple-500)
      iconHover: 'group-hover:bg-[#9333ea]', // purple-600
      trend: trend?.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
      ghost: 'bg-purple-500/5',
    },
    orange: {
      icon: 'bg-[#f59e0b] text-white', // Warning orange (warning-500)
      iconHover: 'group-hover:bg-[#d97706]', // warning-600
      trend: trend?.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
      ghost: 'bg-orange-500/5',
    },
  };

  const scheme = colorSchemes[colorScheme as keyof typeof colorSchemes] || colorSchemes.blue;

  return (
    <Card
      className="relative group transition-all duration-300 overflow-hidden border border-gray-200 hover:shadow-lg"
      role="article"
      aria-label={`${title}: ${formattedValue}${trend ? `, ${trend.isPositive ? 'up' : 'down'} ${formatTrend(trend.value, trend.isPositive)}` : ''}`}
    >
      {/* Dynamic Background Accent */}
      <div 
        className={cn('absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl opacity-10 transition-all duration-300 group-hover:opacity-20', scheme.ghost)} 
        aria-hidden="true" 
      />

      {/* Main Content - 20px padding as per spec */}
      <div className="relative p-5 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          {/* Icon Container - 12px padding (p-3), circular shape */}
          <div 
            className={cn(
              'p-3 rounded-full shadow-sm transform transition-all duration-300',
              scheme.icon,
              scheme.iconHover,
              'group-hover:scale-110'
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* Trend Indicator - top-right corner with arrow icons */}
          {trend && (
            <div 
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-300',
                scheme.trend
              )}
            >
              {trend.isPositive ? (
                <ArrowUp className="h-3.5 w-3.5 stroke-[3px]" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 stroke-[3px]" />
              )}
              <span>{formatTrend(trend.value, trend.isPositive)}</span>
            </div>
          )}
        </div>

        <div>
          {/* Display Value - 30px semibold font (text-3xl = 1.875rem = 30px) */}
          <div className="text-3xl font-semibold tracking-tight text-gray-900 mb-1">
            {formattedValue}
          </div>
          
          {/* Metric Label - 12px uppercase with increased letter spacing */}
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </div>
        </div>
      </div>
    </Card>
  );
});
