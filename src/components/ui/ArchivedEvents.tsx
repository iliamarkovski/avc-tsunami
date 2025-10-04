import { Card, CardDescription, CardHeader, CardTitle, EventMatchItem, Matches, Names, Skeleton } from '@/components';
import { Filter } from '@/hooks';
import { getAllDocuments, getDateByTimestamp, getNameById } from '@/lib';
import { QueryKeys } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type Props = {
  queryKey: QueryKeys;
  halls: Names[];
  teams: Names[];
};

const ArchivedEvents = ({ queryKey, halls, teams }: Props) => {
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dateFilter: Filter = useMemo(
    () => ({
      field: 'dateTime',
      operator: '<',
      value: todayStart,
    }),
    [todayStart]
  );

  const { data: events, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => getAllDocuments<Matches>(queryKey, dateFilter),
    staleTime: 1000 * 60 * 5,
  });

  const sortedEvents = events?.sort((a, b) => {
    const dateA = getDateByTimestamp(a.dateTime).getTime();
    const dateB = getDateByTimestamp(b.dateTime).getTime();

    return dateA - dateB;
  });

  if (isLoading) {
    <Card>
      <CardHeader>
        <CardDescription>
          <Skeleton className="h-5" />
        </CardDescription>
        <CardTitle>
          <Skeleton className="h-8" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5" />
        </CardDescription>
      </CardHeader>
    </Card>;
  }

  return (
    <>
      {sortedEvents?.map((event) => {
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
            queryKey={queryKey}
          />
        );
      })}
    </>
  );
};

export { ArchivedEvents };
