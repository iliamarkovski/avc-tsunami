import { Card, CardHeader, Skeleton } from '@/components';

type Props = {
  isCurrent?: boolean;
};

const SkeletonEventItem = ({ isCurrent }: Props) => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5" />
        <Skeleton className="h-8" />
        <Skeleton className="h-5" />

        {isCurrent ? (
          <div className="!mt-4 flex flex-col items-center gap-4">
            <Skeleton className="h-[45px] w-[220px]" />
            <div className="flex flex-wrap items-center justify-center gap-1">
              <Skeleton className="h-[24px] w-[56px]" />
              <Skeleton className="h-[24px] w-[53px]" />
              <Skeleton className="h-[24px] w-[24px] rounded-full" />
            </div>
          </div>
        ) : null}
      </CardHeader>
    </Card>
  );
};

export { SkeletonEventItem };
