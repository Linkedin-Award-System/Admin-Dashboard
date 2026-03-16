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
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 text-red-700 mb-3">
          <div className="p-2 bg-red-200/50 rounded-xl">
            <Landmark className="h-5 w-5" />
          </div>
          <p className="font-bold text-sm">Error Loading Revenue</p>
        </div>
        <p className="text-xs text-red-600 font-medium">Unable to retrieve revenue data. Please try again.</p>
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
