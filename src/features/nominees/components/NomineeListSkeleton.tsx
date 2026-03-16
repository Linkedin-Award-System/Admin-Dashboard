import { Skeleton } from '@/shared/design-system/components/Skeleton/Skeleton';

export const NomineeListSkeleton = () => {
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

      {/* Filter Bar Skeleton */}
      <div className="flex items-center gap-4 bg-bg-tertiary/30 p-4 rounded-[1.5rem] border border-border-light">
        <Skeleton variant="text" width="128px" height="24px" className="ml-2" />
        <Skeleton variant="rectangular" width="256px" height="44px" className="rounded-xl" />
      </div>

      {/* Grid Sections Skeleton */}
      <div className="space-y-12">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border-light/50" />
              <Skeleton variant="text" width="192px" height="24px" className="rounded-lg" />
              <div className="h-px flex-1 bg-border-light/50" />
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-border-light shadow-soft overflow-hidden">
                  <Skeleton variant="rectangular" width="100%" height="224px" />
                  <div className="p-7 space-y-6">
                    <div className="space-y-2">
                      <Skeleton variant="text" width="75%" height="24px" className="rounded-lg" />
                      <Skeleton variant="text" width="33%" height="20px" className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton variant="text" width="100%" height="16px" className="rounded-lg" />
                      <Skeleton variant="text" width="83%" height="16px" className="rounded-lg" />
                    </div>
                    <div className="flex items-center gap-3 pt-6 border-t border-border-light/50">
                      <Skeleton variant="rectangular" height="40px" className="flex-1 rounded-xl" />
                      <Skeleton variant="rectangular" width="40px" height="40px" className="rounded-xl" />
                      <Skeleton variant="rectangular" width="40px" height="40px" className="rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
