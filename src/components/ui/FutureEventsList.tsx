import { EventMatchItem, EventTrainingItem, Matches, NotFoundEvents, Training } from '@/components';
import { QUERY_KEYS } from '@/constants';
import { useData } from '@/contexts';
import { getDateByTimestamp, getNameById, separateEvents } from '@/lib';
import { useMemo } from 'react';
import { QueryKeys } from '@/types';

type CommonProps = { badge: string; isCurrent: boolean };
type EventProps = ({ tag: 'training' } & Training & CommonProps) | ({ tag: 'match' } & Matches & CommonProps);

const FutureEventsList = () => {
  const { data } = useData();
  const { ivl, volleymania, training, halls, teams } = data;

  const taggedFutureIvl = useMemo(() => {
    const { futureEvents: futureIvl } = separateEvents(ivl);
    return futureIvl.map((event, index) => ({
      ...event,
      tag: QUERY_KEYS.IVL,
      badge: 'IVL',
      isCurrent: index === 0,
    }));
  }, [ivl]);

  const taggedFutureVolleyMania = useMemo(() => {
    const { futureEvents: futureVolleyMania } = separateEvents(volleymania);
    return futureVolleyMania.map((event, index) => ({
      ...event,
      tag: QUERY_KEYS.VOLLEYMANIA,
      badge: 'Volley Mania',
      isCurrent: index === 0,
    }));
  }, [volleymania]);

  const taggedFutureTraining = useMemo(() => {
    const { futureEvents: futureTraining } = separateEvents(training);
    return futureTraining.map((event, index) => ({
      ...event,
      tag: QUERY_KEYS.TRAINING,
      badge: 'Тренировка',
      isCurrent: index === 0,
    }));
  }, [training]);

  const taggedEvents = useMemo(() => {
    return [...taggedFutureIvl, ...taggedFutureVolleyMania, ...taggedFutureTraining];
  }, [taggedFutureIvl, taggedFutureVolleyMania, taggedFutureTraining]) as EventProps[];

  const sortedEvents = useMemo(() => {
    return [...taggedEvents].sort(
      (a, b) => getDateByTimestamp(a.dateTime).getTime() - getDateByTimestamp(b.dateTime).getTime()
    );
  }, [taggedEvents]);

  if (sortedEvents.length === 0) {
    return <NotFoundEvents />;
  }

  return (
    <div className="grid gap-4">
      {sortedEvents.map((event) => {
        const hall = getNameById(halls, event.hall);
        const dateTime = getDateByTimestamp(event.dateTime);

        if (event.tag === 'training') {
          return (
            <EventTrainingItem
              badge={event.badge}
              isCurrent={event.isCurrent}
              message={event.message}
              key={event.id}
              id={event.id!}
              dateTime={dateTime}
              hall={hall}
            />
          );
        }

        const opponent = getNameById(teams, event.opponent);
        return (
          <EventMatchItem
            key={event.id}
            badge={event.badge}
            gamesGuest={event.gamesGuest}
            gamesHost={event.gamesHost}
            isCurrent={event.isCurrent}
            message={event.message}
            recordingUrl={event.recordingLink}
            statisticsUrl={event.statisticsDocUrl}
            id={event.id!}
            queryKey={event.tag as QueryKeys}
            dateTime={dateTime}
            hall={hall}
            opponent={opponent}
            isHost={event.host}
            isFuture
          />
        );
      })}
    </div>
  );
};

export { FutureEventsList };
