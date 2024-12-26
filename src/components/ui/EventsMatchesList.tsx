import { fetchAllDocuments } from '@/api';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EventMatchItem,
  Matches,
  Names,
  NotFoundEvents,
  SkeletonEventItem,
} from '@/components';
import { HALLS_KEY, TEAMS_KEY } from '@/constants';
import { getDateByTimestamp, getNameById, separateEvents } from '@/lib';
import { useQuery } from '@tanstack/react-query';
import { Archive } from 'lucide-react';

type Props = {
  queryKey: string;
};

const EventsMatchesList = ({ queryKey }: Props) => {
  const { data: events, isFetched: isFetchedEvents } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllDocuments<Matches>(queryKey),
    staleTime: 60 * 60 * 1000,
  });

  const { data: halls, isFetched: isFetchedHalls } = useQuery({
    queryKey: [HALLS_KEY],
    queryFn: () => fetchAllDocuments<Names>(HALLS_KEY),
    staleTime: 60 * 60 * 1000,
  });

  const { data: teams, isFetched: isFetchedTeams } = useQuery({
    queryKey: [TEAMS_KEY],
    queryFn: () => fetchAllDocuments<Names>(TEAMS_KEY),
    staleTime: 60 * 60 * 1000,
  });

  if (!isFetchedEvents || !isFetchedHalls || !isFetchedTeams) {
    return <SkeletonEventItem isCurrent />;
  }

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
              const date = getDateByTimestamp(event.dateTime);
              return (
                <EventMatchItem
                  key={event.id}
                  id={event.id}
                  date={date}
                  hall={hall}
                  isHost={event.host}
                  opponent={opponent}
                  gamesHost={event.gamesHost}
                  gamesGuest={event.gamesGuest}
                  recordingUrl={event.youtubeLink}
                  // statisticsUrl={event.statistics?.url || null}
                  collection={queryKey}
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
            const date = getDateByTimestamp(event.dateTime);
            return (
              <EventMatchItem
                key={event.id}
                id={event.id}
                date={date}
                hall={hall}
                isHost={event.host}
                opponent={opponent}
                gamesHost={event.gamesHost}
                gamesGuest={event.gamesGuest}
                recordingUrl={event.youtubeLink}
                // statisticsUrl={event.statistics?.url || null}
                isCurrent={index === 0}
                collection={queryKey}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export { EventsMatchesList };
