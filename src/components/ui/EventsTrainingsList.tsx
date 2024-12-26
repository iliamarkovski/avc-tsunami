import { fetchAllDocuments } from '@/api';
import { EventTrainingItem, Names, NotFoundEvents, SkeletonEventItem, Training } from '@/components';
import { HALLS_KEY, TRAINING_KEY } from '@/constants';
import { getDateByTimestamp, getNameById, separateEvents } from '@/lib';
import { useQuery } from '@tanstack/react-query';

const EventsTrainingsList = () => {
  const { data: events, isFetched: isFetchedEvents } = useQuery({
    queryKey: [TRAINING_KEY],
    queryFn: () => fetchAllDocuments<Training>(TRAINING_KEY),
    staleTime: 60 * 60 * 1000,
  });

  const { data: halls, isFetched: isFetchedHalls } = useQuery({
    queryKey: [HALLS_KEY],
    queryFn: () => fetchAllDocuments<Names>(HALLS_KEY),
    staleTime: 60 * 60 * 1000,
  });

  if (!isFetchedEvents || !isFetchedHalls) {
    return <SkeletonEventItem isCurrent />;
  }

  if (!events || events.length === 0) {
    return <NotFoundEvents />;
  }

  const { futureEvents } = separateEvents(events);

  return (
    <div className="grid gap-4">
      {futureEvents.map((event, index) => {
        const hall = getNameById(halls, event.hall);
        const date = getDateByTimestamp(event.dateTime);

        return <EventTrainingItem key={event.id} id={event.id} date={date} hall={hall} isCurrent={index === 0} />;
      })}
    </div>
  );
};

export { EventsTrainingsList };
