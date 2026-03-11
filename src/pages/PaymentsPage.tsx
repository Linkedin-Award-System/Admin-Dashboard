import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { PaymentList, PaymentFiltersForm, RevenueCard } from '@/features/payments';
import type { PaymentFilters } from '@/features/payments';

export const PaymentsPage = () => {
  const [filters, setFilters] = useState<PaymentFilters | undefined>(undefined);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Payment Transactions</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Track and manage payment transactions
          </p>
        </div>

        <RevenueCard />

        <PaymentFiltersForm onFilterChange={setFilters} />

        <PaymentList filters={filters} />
      </div>
    </Layout>
  );
};

export default PaymentsPage;
