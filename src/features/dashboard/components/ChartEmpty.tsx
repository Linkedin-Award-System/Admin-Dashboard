import { BarChart3 } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import type { LucideIcon } from 'lucide-react';

/**
 * ChartEmpty Component
 * 
 * Empty state display for chart components when no data is available.
 * Shows a friendly message with an icon to guide users.
 */
export function ChartEmpty({ 
  message = 'No data available',
  icon: Icon = BarChart3,
}: { 
  message?: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          {message}
        </p>
        <p className="text-xs text-gray-500">
          Data will appear here once available
        </p>
      </div>
    </Card>
  );
}
