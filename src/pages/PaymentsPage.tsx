import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { PaymentList, PaymentFiltersForm, RevenueCard } from '@/features/payments';
import type { PaymentFilters } from '@/features/payments';
import { PageHeader } from '@/shared/design-system/patterns/PageHeader/PageHeader';
import { Button } from '@/shared/design-system/components/Button/Button';
import { Download } from 'lucide-react';

export const PaymentsPage = () => {
  const [filters, setFilters] = useState<PaymentFilters | undefined>(undefined);

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export payments data');
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 lg:px-12 py-8 max-w-7xl">
        {/* Page Header with title and export button */}
        <PageHeader 
          title="Payments"
          subtitle="Track and manage platform transactions and revenue"
          actions={
            <Button 
              variant="secondary" 
              icon={<Download size={16} />}
              onClick={handleExport}
            >
              Export
            </Button>
          }
        />

        {/* Main content grid with 16px gaps */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
          {/* Left column: Revenue card and filters */}
          <div className="xl:col-span-1 space-y-4">
            <RevenueCard />
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Transaction Filters
              </h3>
              <PaymentFiltersForm onFilterChange={setFilters} />
            </div>
          </div>
          
          {/* Right column: Payment list */}
          <div className="xl:col-span-3">
            <PaymentList filters={filters} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
