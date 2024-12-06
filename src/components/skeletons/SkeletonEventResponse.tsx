import { Skeleton } from '@/components';

const SkeletonEventResponse = () => {
  return (
    <div className="!mt-6 flex flex-col items-center gap-3">
      <Skeleton className="h-[45px] w-[220.61px]" />
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Skeleton className="h-[24px] w-[56px]" />
        <Skeleton className="h-[24px] w-[53px]" />
        <Skeleton className="h-[24px] w-[104px]" />
        <Skeleton className="h-[24px] w-[24px] rounded-full" />
      </div>
    </div>
  );
};

export { SkeletonEventResponse };
