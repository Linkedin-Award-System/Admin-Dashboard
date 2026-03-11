import { useTotalRevenue } from '../hooks/use-payments';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
  }).format(amount);
};

export const RevenueCard = () => {
  const { data: totalRevenue, isLoading, error } = useTotalRevenue();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-red-800">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">Error loading revenue</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(totalRevenue || 0)}</div>
        <p className="text-xs text-gray-500 mt-1">From completed transactions</p>
      </CardContent>
    </Card>
  );
};
