import { fetchEvents, Event } from '@/api';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EventItem,
  SkeletonEventItem,
} from '@/components';
import { EventState, EventType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { addDays, format, isBefore } from 'date-fns';
import { Archive, CalendarX2 } from 'lucide-react';

type Props = {
  type: EventType;
};

const separateEvents = (events: Event[]) => {
  const today = new Date();
  const pastEvents: Event[] = [];
  const futureEvents: Event[] = [];

  events.forEach((event) => {
    if (isBefore(event.date, addDays(today, -1)) || event.winOrLose) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  return { pastEvents, futureEvents };
};

const renderEventItem = (event: Event, variant?: EventState) => {
  const opponentName = event.opponent.name;
  const hallName = event.hall.name;
  const date = format(event.date, 'dd.MM.yyyy');
  const time = format(event.date, 'HH:mm');
  const isHost = event.hostOrGuest === 'host';
  const games = event.lostGames ?? event.wonGames;
  const statistics = event.statistics?.url || null;

  return (
    <EventItem
      key={event.id}
      date={date}
      hall={hallName}
      isHost={isHost}
      opponent={opponentName}
      time={time}
      result={event.winOrLose}
      games={games}
      recordingUrl={event.recording}
      statisticsUrl={statistics}
      variant={variant}
    />
  );
};

const NotFoundEvents = () => {
  return (
    <Alert variant="destructive">
      <CalendarX2 className="size-5" />
      <AlertTitle>Не са намерени резултати</AlertTitle>
      <AlertDescription>Няма предстоящи мачове</AlertDescription>
    </Alert>
  );
};

const EventsList = ({ type }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: [type],
    queryFn: () => fetchEvents({ type }),
  });

  if (isLoading) {
    return <SkeletonEventItem />;
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
            {pastEvents.map((event) => renderEventItem(event, 'past'))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {!futureEvents || futureEvents.length === 0 ? (
        <NotFoundEvents />
      ) : (
        <>{futureEvents.map((event, index) => renderEventItem(event, index === 0 ? 'current' : 'future'))}</>
      )}
    </div>
  );
};

export { EventsList };
