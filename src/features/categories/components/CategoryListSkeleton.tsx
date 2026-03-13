import { Skeleton } from '@/shared/design-system/components/Skeleton';

export const CategoryListSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-border-light shadow-soft">
        <div className="flex items-center gap-3">
          <Skeleton variant="rectangular" width="56px" height="56px" animation="wave" className="rounded-2xl" />
          <div className="space-y-2">
            <Skeleton variant="text" width="160px" height="32px" animation="wave" />
            <Skeleton variant="text" width="256px" height="16px" animation="wave" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="rectangular" width="128px" height="48px" animation="wave" className="rounded-2xl" />
          <Skeleton variant="rectangular" width="160px" height="48px" animation="wave" className="rounded-2xl" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton variant="rectangular" height="56px" animation="wave" className="flex-1 rounded-2xl" />
        <Skeleton variant="rectangular" width="56px" height="56px" animation="wave" className="rounded-2xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] border border-border-light shadow-soft space-y-6">
            <div className="flex items-start justify-between">
              <Skeleton variant="rectangular" width="56px" height="56px" animation="wave" className="rounded-2xl" />
              <Skeleton variant="rectangular" width="96px" height="24px" animation="wave" className="rounded-full" />
            </div>
            <div className="space-y-3">
              <Skeleton variant="text" width="75%" height="24px" animation="wave" />
              <Skeleton variant="text" width="100%" height="16px" animation="wave" />
              <Skeleton variant="text" width="85%" height="16px" animation="wave" />
            </div>
            <div className="flex justify-end gap-2 pt-6 border-t border-border-light/50">
              <Skeleton variant="rectangular" width="40px" height="40px" animation="wave" className="rounded-xl" />
              <Skeleton variant="rectangular" width="40px" height="40px" animation="wave" className="rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
