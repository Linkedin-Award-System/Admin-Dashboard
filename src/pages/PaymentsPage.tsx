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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="container mx-auto px-6 lg:px-12 py-8 max-w-7xl">
          {/* Enhanced Page Header with gradient background */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <PageHeader 
              title="Payments"
              subtitle="Track and manage platform transactions and revenue"
              actions={
                <Button 
                  variant="secondary" 
                  icon={<Download size={16} />}
                  onClick={handleExport}
                  className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Export
                </Button>
              }
            />
          </div>

          {/* Main content grid with enhanced spacing and animations */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            {/* Left column: Revenue card and filters with staggered animation */}
            <div className="xl:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <RevenueCard />
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Transaction Filters
                  </h3>
                </div>
                <PaymentFiltersForm onFilterChange={setFilters} />
              </div>
            </div>
            
            {/* Right column: Payment list with delayed animation */}
            <div className="xl:col-span-3 animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
              <PaymentList filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
