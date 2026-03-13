
import { Skeleton } from '@/shared/design-system/components/Skeleton';
import { Card } from '@/shared/components/ui/card';

/**
 * MetricCardSkeleton Component
 * 
 * Loading skeleton that matches the MetricCard layout.
 * Uses enhanced Skeleton component with wave animation.
 * Matches dimensions of actual MetricCard content.
 * 
 * Layout matches MetricCard:
 * - 20px padding (p-5)
 * - Icon: 48px circular (h-12 w-12 with p-3 = 48px total)
 * - Trend: 28px height, 80px width
 * - Value: 36px height (text-3xl)
 * - Label: 16px height (text-xs)
 */
export function MetricCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border border-gray-200">
      {/* Main Content - 20px padding matching MetricCard */}
      <div className="relative p-5 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          {/* Icon skeleton - circular, 48px (matches icon container with padding) */}
          <Skeleton variant="circular" width="48px" height="48px" />

          {/* Trend indicator skeleton - rounded pill shape */}
          <Skeleton variant="rectangular" width="80px" height="28px" className="rounded-full" />
        </div>

        <div className="space-y-2">
          {/* Value skeleton - matches text-3xl height (36px), 75% width */}
          <Skeleton variant="rectangular" width="75%" height="36px" />
          
          {/* Label skeleton - matches text-xs height (16px), 50% width */}
          <Skeleton variant="text" width="50%" height="16px" />
        </div>
      </div>
    </Card>
  );
}
