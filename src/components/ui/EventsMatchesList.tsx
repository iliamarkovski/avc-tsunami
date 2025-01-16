import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EventMatchItem,
  Matches,
  NotFoundEvents,
} from '@/components';
import { useData } from '@/contexts';
import { getDateByTimestamp, getNameById, separateEvents } from '@/lib';
import { QueryKeys } from '@/types';
import { Archive } from 'lucide-react';

type Props = {
  queryKey: QueryKeys;
};

const EventsMatchesList = ({ queryKey }: Props) => {
  const { data } = useData();
  const { halls, teams } = data;
  const events = data[queryKey] as Matches[];

  if (!events || events.length === 0) {
    return <NotFoundEvents />;
  }

  const { pastEvents, futureEvents } = separateEvents(events);

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
            {pastEvents.map((event) => {
              const hall = getNameById(halls, event.hall);
              const opponent = getNameById(teams, event.opponent);
              const dateTime = getDateByTimestamp(event.dateTime);
              return (
                <EventMatchItem
                  key={event.id}
                  id={event.id!}
                  dateTime={dateTime}
                  hall={hall}
                  isHost={event.host}
                  opponent={opponent}
                  gamesHost={event.gamesHost}
                  gamesGuest={event.gamesGuest}
                  recordingUrl={event.recordingLink}
                  // statisticsUrl={event.statistics?.url || null}
                  queryKey={queryKey}
                  message={event.message}
                />
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      )}

      {!futureEvents || futureEvents.length === 0 ? (
        <NotFoundEvents />
      ) : (
        <>
          {futureEvents.map((event, index) => {
            const hall = getNameById(halls, event.hall);
            const opponent = getNameById(teams, event.opponent);
            const dateTime = getDateByTimestamp(event.dateTime);
            return (
              <EventMatchItem
                key={event.id}
                id={event.id!}
                dateTime={dateTime}
                hall={hall}
                isHost={event.host}
                opponent={opponent}
                gamesHost={event.gamesHost}
                gamesGuest={event.gamesGuest}
                recordingUrl={event.recordingLink}
                // statisticsUrl={event.statistics?.url || null}
                isCurrent={index === 0}
                queryKey={queryKey}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export { EventsMatchesList };
