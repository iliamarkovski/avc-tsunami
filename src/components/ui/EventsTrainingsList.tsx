import { fetchTrainigs } from '@/api';
import { EventTrainingItem, NotFoundEvents, SkeletonEventItem } from '@/components';
import { useQuery } from '@tanstack/react-query';

const EventsTrainingsList = () => {
  const { data, isFetched } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => fetchTrainigs(),
  });
  if (!isFetched) {
    return <SkeletonEventItem isCurrent />;
  }
  if (!data || data.length === 0) {
    return <NotFoundEvents />;
  }

  return (
    <div className="grid gap-4">
      {data.map((event, index) => {
        const hallName = event.defaultHall ? `"Васил Симов"` : event.hall?.name || '???';

        return (
          <EventTrainingItem key={event.id} id={event.id} date={event.date} hall={hallName} isCurrent={index === 0} />
        );
      })}
    </div>
  );
};

export { EventsTrainingsList };
