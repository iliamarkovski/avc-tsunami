import { Skeleton } from '@/components';

const SkeletonEventResponse = () => {
  return (
    <div className="!mt-6 flex flex-col items-center gap-3">
      <Skeleton className="h-[45px] w-[220.61px]" />
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Skeleton className="h-[24.5px] w-[60px]" />
        <Skeleton className="h-[24.5px] w-[60px]" />
        <Skeleton className="h-[24.5px] w-[60px]" />
      </div>
    </div>
  );
};

export { SkeletonEventResponse };
