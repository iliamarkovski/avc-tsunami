import { Card, CardHeader, Skeleton } from '@/components';

const SkeletonEventItem = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5" />
        <Skeleton className="h-6" />
        <Skeleton className="h-5" />
      </CardHeader>
    </Card>
  );
};

export { SkeletonEventItem };
