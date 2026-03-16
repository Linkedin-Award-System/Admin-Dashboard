import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

/**
 * ChartError Component
 * 
 * Error state display for chart components.
 * Shows a clear error message with a retry button to attempt reloading the data.
 */
export function ChartError({ 
  error, 
  onRetry 
}: { 
  error: Error; 
  onRetry: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load chart data
        </h3>
        <p className="text-sm text-gray-600 mb-6 max-w-md">
          {error.message || 'An unexpected error occurred while loading the chart.'}
        </p>
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </Card>
  );
}
