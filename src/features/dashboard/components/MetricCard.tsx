import { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/lib/utils';
import type { MetricCardProps } from '../types';
import { formatNumber, formatCurrency, formatPercentage, formatTrend } from '../utils/format-utils';
import { useCountUp } from '../hooks/use-count-up';

export const MetricCard = memo(function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  format = 'number',
  colorScheme = 'blue',
}: MetricCardProps) {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const numericValue = typeof value === 'number' ? value : 0;
  const animatedValue = useCountUp(numericValue, 1500, !prefersReducedMotion && typeof value === 'number');

  const displayValue = typeof value === 'string' ? value : animatedValue;
  const formattedValue = typeof value === 'string'
    ? value
    : format === 'currency'
    ? formatCurrency(displayValue as number)
    : format === 'percentage'
    ? formatPercentage(displayValue as number, false)
    : formatNumber(displayValue as number);

  const colorSchemes = {
    blue: {
      iconBg: 'bg-blue-600',
      iconRing: 'ring-blue-100',
      accent: 'from-blue-500/10 to-transparent',
      trendPositive: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      trendNegative: 'bg-red-50 text-red-600 border border-red-200',
      dot: 'bg-blue-500',
    },
    green: {
      iconBg: 'bg-emerald-500',
      iconRing: 'ring-emerald-100',
      accent: 'from-emerald-500/10 to-transparent',
      trendPositive: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      trendNegative: 'bg-red-50 text-red-600 border border-red-200',
      dot: 'bg-emerald-500',
    },
    purple: {
      iconBg: 'bg-purple-500',
      iconRing: 'ring-purple-100',
      accent: 'from-purple-500/10 to-transparent',
      trendPositive: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      trendNegative: 'bg-red-50 text-red-600 border border-red-200',
      dot: 'bg-purple-500',
    },
    orange: {
      iconBg: 'bg-amber-500',
      iconRing: 'ring-amber-100',
      accent: 'from-amber-500/10 to-transparent',
      trendPositive: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      trendNegative: 'bg-red-50 text-red-600 border border-red-200',
      dot: 'bg-amber-500',
    },
  };

  const scheme = colorSchemes[colorScheme as keyof typeof colorSchemes] || colorSchemes.blue;
  const trendClass = trend?.isPositive ? scheme.trendPositive : scheme.trendNegative;

  return (
    <Card
      className="relative group overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
      role="article"
      aria-label={`${title}: ${formattedValue}${trend ? `, ${trend.isPositive ? 'up' : 'down'} ${formatTrend(trend.value, trend.isPositive)}` : ''}`}
    >
      {/* Gradient accent top-right — decorative arc/curl */}
      <div
        className={cn('absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl rounded-full -translate-y-1/2 translate-x-1/2 opacity-60', scheme.accent)}
        aria-hidden="true"
      />

      {/* Trend badge — centered on the arc curl at top-right corner */}
      {trend && (
        <div className={cn(
          'absolute top-0 right-0 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm -translate-x-1/2 translate-y-1/2',
          trendClass,
        )}>
          {trend.isPositive
            ? <TrendingUp className="h-3.5 w-3.5" />
            : <TrendingDown className="h-3.5 w-3.5" />
          }
          <span>{formatTrend(trend.value, trend.isPositive)}</span>
        </div>
      )}

      <div className="relative p-5">
        {/* Top row: icon only */}
        <div className="flex items-start mb-4">
          {/* Icon */}
          <div className={cn(
            'p-3 rounded-2xl text-white shadow-sm ring-4 transition-transform duration-300 group-hover:scale-105',
            scheme.iconBg,
            scheme.iconRing,
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {/* Value */}
        <div className="text-2xl font-bold tracking-tight text-gray-900 mb-0.5">
          {formattedValue}
        </div>

        {/* Label */}
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </div>

        {/* Bottom divider with trend context */}
        {trend && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', trend.isPositive ? 'bg-emerald-500' : 'bg-red-400')} />
            <span className="text-xs text-gray-400">
              {trend.isPositive ? 'Up' : 'Down'} {formatTrend(trend.value, trend.isPositive)} from last period
            </span>
          </div>
        )}
      </div>
    </Card>
  );
});
