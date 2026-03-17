import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { PaymentList, PaymentFiltersForm, RevenueCard } from '@/features/payments';
import type { PaymentFilters } from '@/features/payments';
import { PageHeader } from '@/shared/design-system/patterns/PageHeader/PageHeader';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { usePayments } from '@/features/payments/hooks/use-payments';

const PaymentsPageInner = () => {
  const [filters, setFilters] = useState<PaymentFilters | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: payments } = usePayments(filters);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        <div className="mb-8">
          <PageHeader
            title="Financials"
            subtitle="Track and manage platform transactions and revenue"
            actions={
              <ExportButton
                onExport={(format) => exportService.exportPayments(format, payments ?? [])}
                filename="payments"
                label="Export All"
                className="rounded-2xl border-border-light hover:bg-bg-tertiary font-semibold h-12 px-6"
              />
            }
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Left sidebar: Revenue card + filters */}
          <div className="xl:col-span-1 space-y-5 animate-in fade-in slide-in-from-left-4 duration-700">
            <RevenueCard />
            <div className="bg-white p-5 rounded-[1.75rem] border border-border-light shadow-sm">
              <PaymentFiltersForm
                onFilterChange={setFilters}
                onSearchChange={setSearchQuery}
              />
            </div>
          </div>

          {/* Right: Transaction list */}
          <div className="xl:col-span-3 animate-in fade-in slide-in-from-right-4 duration-700">
            <PaymentList filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const PaymentsPage = PaymentsPageInner;
export default PaymentsPage;
