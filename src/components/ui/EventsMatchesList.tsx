import { fetchMatches, Event } from '@/api';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EventMatchItem,
  NotFoundEvents,
  SkeletonEventItem,
} from '@/components';
import { EventType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { isBefore, startOfDay } from 'date-fns';
import { Archive } from 'lucide-react';

type Props = {
  type: EventType;
};

const separateEvents = (events: Event[]) => {
  const today = startOfDay(new Date());
  const pastEvents: Event[] = [];
  const futureEvents: Event[] = [];

  events.forEach((event) => {
    const eventDay = startOfDay(new Date(event.date));

    if (event.winOrLose || isBefore(eventDay, today)) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  return { pastEvents, futureEvents };
};

const renderEventItem = (event: Event & { type: EventType }, isCurrent?: boolean) => {
  return (
    <EventMatchItem
      key={event.id}
      id={event.id}
      date={event.date}
      hall={event.hall?.name ?? '???'}
      isHost={event.hostOrGuest === 'host'}
      opponent={event.opponent?.name ?? '???'}
      result={event.winOrLose}
      games={event.lostGames ?? event.wonGames}
      recordingUrl={event.recording}
      statisticsUrl={event.statistics?.url || null}
      isCurrent={isCurrent}
      eventType={event.type}
    />
  );
};

const EventsMatchesList = ({ type }: Props) => {
  const { data, isFetched } = useQuery({
    queryKey: [type],
    queryFn: () => fetchMatches({ type }),
  });

  if (!isFetched) {
    return <SkeletonEventItem isCurrent />;
  }

  if (!data || data.length === 0) {
    return <NotFoundEvents />;
  }

  const { pastEvents, futureEvents } = separateEvents(data);

  return (
    <div className="grid gap-4">
      {pastEvents.length > 0 && (
        <Collapsible className="space-y-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              <Archive /> Архив
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="grid gap-4">
            {pastEvents.map((event) => renderEventItem({ ...event, type }))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {!futureEvents || futureEvents.length === 0 ? (
        <NotFoundEvents />
      ) : (
        <>{futureEvents.map((event, index) => renderEventItem({ ...event, type }, index === 0))}</>
      )}
    </div>
  );
};

export { EventsMatchesList };
