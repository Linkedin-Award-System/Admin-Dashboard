import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const NomineeListSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="space-y-6">
        {[1, 2].map((categoryIndex) => (
          <div key={categoryIndex}>
            <Skeleton className="h-7 w-40 mb-3" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="w-full h-48 rounded-md mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-3" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
