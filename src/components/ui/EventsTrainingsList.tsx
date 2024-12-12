import { fetchTrainigs } from '@/api';
import { Alert, AlertDescription, AlertTitle, EventTrainingItem, SkeletonEventItem } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarX2 } from 'lucide-react';

const NotFoundEvents = () => {
  return (
    <Alert variant="destructive">
      <CalendarX2 className="size-5" />
      <AlertTitle>Не са намерени резултати</AlertTitle>
      <AlertDescription>Няма предстоящи събития</AlertDescription>
    </Alert>
  );
};

const EventsTrainingsList = () => {
  const { data, isFetched } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => fetchTrainigs(),
  });

  if (!isFetched) {
    return <SkeletonEventItem />;
  }

  if (!data || data.length === 0) {
    return <NotFoundEvents />;
  }

  return (
    <div className="grid gap-4">
      {!data || data.length === 0 ? (
        <NotFoundEvents />
      ) : (
        <>
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
                variant={index === 0 ? 'current' : 'future'}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export { EventsTrainingsList };
