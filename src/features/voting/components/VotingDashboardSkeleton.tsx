import { Skeleton } from '@/shared/design-system/components/Skeleton';

export const VotingDashboardSkeleton = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Metrics Row Skeleton */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-border-light shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Skeleton variant="circular" width={56} height={56} />
              <Skeleton variant="text" width={80} height={12} />
            </div>
            <Skeleton variant="text" width={120} height={14} className="mb-1" />
            <Skeleton variant="rectangular" width={100} height={36} />
          </div>
        ))}
      </div>

      {/* Leading Nominees Board Skeleton */}
      <div className="bg-white rounded-[2.5rem] border border-border-light shadow-premium overflow-hidden">
        <div className="p-8 border-b border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton variant="text" width={200} height={28} />
            </div>
            <Skeleton variant="text" width={250} height={16} className="mt-1" />
          </div>
          <Skeleton variant="rectangular" width={180} height={44} className="rounded-xl" />
        </div>

        <div className="p-2">
          <div className="grid grid-cols-1 divide-y divide-border-light/50">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl mx-2"
              >
                <div className="flex items-center gap-5">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div>
                    <Skeleton variant="text" width={100} height={12} className="mb-1" />
                    <Skeleton variant="text" width={180} height={20} />
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 flex items-center gap-6">
                  <div className="text-right">
                    <Skeleton variant="text" width={60} height={24} className="mb-1" />
                    <Skeleton variant="text" width={80} height={12} />
                  </div>
                  <Skeleton variant="circular" width={20} height={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
