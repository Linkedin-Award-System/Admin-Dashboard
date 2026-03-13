import { Skeleton } from '@/shared/design-system/components/Skeleton';

export const PaymentListSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-border-light shadow-soft">
        <div className="flex items-center gap-3">
          <Skeleton variant="rectangular" width="56px" height="56px" className="rounded-2xl" />
          <div className="space-y-2">
            <Skeleton variant="text" width="160px" height="32px" />
            <Skeleton variant="text" width="256px" height="16px" />
          </div>
        </div>
        <Skeleton variant="rectangular" width="160px" height="48px" className="rounded-2xl" />
      </div>

      {/* Transaction Rows Skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className="bg-white p-6 rounded-[1.5rem] border border-border-light shadow-soft-sm"
          >
            <div className="flex flex-col xl:flex-row xl:items-center gap-6">
              {/* Status Indicator Area */}
              <div className="flex items-center gap-4 xl:w-64 shrink-0">
                <Skeleton variant="rectangular" width="48px" height="48px" className="rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton variant="text" width="96px" height="20px" />
                  <Skeleton variant="text" width="128px" height="12px" />
                </div>
              </div>

              {/* Transaction ID & Meta */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton variant="text" width="80px" height="12px" />
                    <Skeleton variant="text" width="75%" height="20px" />
                  </div>
                ))}
              </div>

              {/* Amount Area */}
              <div className="xl:w-48 flex items-center justify-between xl:justify-end gap-6 border-t xl:border-t-0 pt-4 xl:pt-0">
                <div className="space-y-1">
                  <Skeleton variant="text" width="64px" height="12px" />
                  <Skeleton variant="text" width="128px" height="32px" />
                </div>
                <Skeleton variant="rectangular" width="40px" height="40px" className="rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
