import { useTotalRevenue } from '../hooks/use-payments';
import { Landmark } from 'lucide-react';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import { MetricCardSkeleton } from '@/features/dashboard/components/MetricCardSkeleton';

export const RevenueCard = () => {
  const { data: totalRevenue, isLoading, error } = useTotalRevenue();

  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-5">
        <div className="flex items-center gap-3 text-red-600 mb-2">
          <Landmark className="h-5 w-5" />
          <p className="font-semibold text-sm">Error Loading Revenue</p>
        </div>
        <p className="text-xs text-red-600">Unable to retrieve revenue data</p>
      </div>
    );
  }

  return (
    <MetricCard
      title="Total Revenue"
      value={totalRevenue || 0}
      icon={Landmark}
      colorScheme="green"
      format="currency"
    />
  );
};
