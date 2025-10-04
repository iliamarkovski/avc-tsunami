import {
  ArchivedEvents,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EventMatchItem,
  Matches,
  NotFoundEvents,
} from '@/components';
import { useData } from '@/contexts';
import { getDateByTimestamp, getNameById } from '@/lib';
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

  return (
    <div className="grid gap-4">
      <Collapsible className="space-y-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline">
            <Archive /> Архив
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="grid gap-4">
          <ArchivedEvents queryKey={queryKey} halls={halls} teams={teams} />
        </CollapsibleContent>
      </Collapsible>

      {events.length === 0 ? (
        <NotFoundEvents />
      ) : (
        <>
          {events.map((event, index) => {
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
                statisticsUrl={event.statisticsDocUrl || null}
                isCurrent={index === 0}
                isFuture
                queryKey={queryKey}
                message={event.message}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export { EventsMatchesList };
