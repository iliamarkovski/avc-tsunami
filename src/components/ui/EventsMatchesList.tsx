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
import { Archive, ArchiveX } from 'lucide-react';
import { useState } from 'react';

type Props = {
  queryKey: QueryKeys;
};

const EventsMatchesList = ({ queryKey }: Props) => {
  const { data } = useData();
  const { halls, teams } = data;
  const events = data[queryKey] as Matches[];
  const [isOpen, setIsOpen] = useState(false);

  if (!events || events.length === 0) {
    return <NotFoundEvents />;
  }

  return (
    <div className="grid gap-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="relative space-y-4">
        <CollapsibleContent className="grid gap-4">
          <ArchivedEvents queryKey={queryKey} halls={halls} teams={teams} />
        </CollapsibleContent>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="sticky bottom-4">
            {isOpen ? <ArchiveX /> : <Archive />}
            {isOpen ? 'Скрий архив' : 'Архив'}
          </Button>
        </CollapsibleTrigger>
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
