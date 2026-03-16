import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/design-system/components/Skeleton';

/**
 * ChartSkeleton Component
 * 
 * Loading skeleton for chart components with animated shimmer effect.
 * Uses enhanced Skeleton component with wave animation.
 * Matches chart dimensions and provides visual feedback while data is loading.
 * 
 * Layout:
 * - Card container with 20px padding (p-5)
 * - Header with icon (24px) and title (24px height, 192px width)
 * - Chart area with configurable height (default 300px)
 * - 16px spacing between elements
 */
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card className="border border-gray-200">
      <div className="p-5 space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton variant="rectangular" width="24px" height="24px" className="rounded" />
          <Skeleton variant="rectangular" width="192px" height="24px" />
        </div>

        {/* Chart area skeleton - matches chart dimensions */}
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={height}
          className="rounded-lg" 
        />
      </div>
    </Card>
  );
}
