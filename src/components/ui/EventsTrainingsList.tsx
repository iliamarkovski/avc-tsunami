import { fetchTrainigs } from '@/api';
import { EventTrainingItem, NotFoundEvents, SkeletonEventItem } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

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
        const hallName = event.defaultHall ? `"Васил Симов"` : event.hall?.name || '-';
        const date = format(event.date, 'dd.MM.yyyy');
        const time = format(event.date, 'HH:mm');

        return (
          <EventTrainingItem
            key={event.id}
            id={event.id}
            time={time}
            date={date}
            hall={hallName}
            isCurrent={index === 0}
          />
        );
      })}
    </div>
  );
};

export { EventsTrainingsList };
