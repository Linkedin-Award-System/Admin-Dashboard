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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <PageHeader
          title="Financials"
          subtitle="Track and manage platform transactions and revenue"
          actions={
            <ExportButton
              onExport={(format) => exportService.exportPayments(format, payments ?? [])}
              filename="payments"
              label="Export All"
              className="rounded-2xl border-border-light hover:bg-bg-tertiary font-semibold h-11 px-5"
            />
          }
        />

        {/* Top strip: Revenue summary + Filters side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Revenue card — takes 1 col */}
          <div className="lg:col-span-1">
            <RevenueCard />
          </div>

          {/* Filters — takes 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-[1.75rem] border border-border-light shadow-sm p-6">
            <PaymentFiltersForm
              onFilterChange={setFilters}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        {/* Transaction list */}
        <PaymentList filters={filters} searchQuery={searchQuery} />
      </div>
    </Layout>
  );
};

export const PaymentsPage = PaymentsPageInner;
export default PaymentsPage;
