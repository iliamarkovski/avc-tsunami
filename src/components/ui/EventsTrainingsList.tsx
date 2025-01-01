import { EventTrainingItem, NotFoundEvents } from '@/components';
import { useData } from '@/contexts';
import { getDateByTimestamp, getNameById, separateEvents } from '@/lib';

const EventsTrainingsList = () => {
  const { data } = useData();
  const { halls, training } = data;

  if (!training || training.length === 0) {
    return <NotFoundEvents />;
  }

  const { futureEvents } = separateEvents(training);

  return (
    <div className="grid gap-4">
      {futureEvents.map((event, index) => {
        const hall = getNameById(halls, event.hall);
        const date = getDateByTimestamp(event.dateTime);

        return <EventTrainingItem key={event.id} id={event.id!} date={date} hall={hall} isCurrent={index === 0} />;
      })}
    </div>
  );
};

export { EventsTrainingsList };
