import { getDateByTimestamp } from './getDateByTimestamp';
import { isBefore, sub } from 'date-fns';

type EventBase = {
  dateTime: Date;
  gamesHost?: string;
  gamesGuest?: string;
};

export const separateEvents = <T extends EventBase>(events: T[]) => {
  const threeHoursAgo = sub(new Date(), { hours: 3 });

  const pastEvents: T[] = [];
  const futureEvents: T[] = [];

  events.forEach((event) => {
    const eventTime = getDateByTimestamp(event.dateTime);

    if ((event.gamesHost && event.gamesGuest) || isBefore(eventTime, threeHoursAgo)) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  return { pastEvents, futureEvents };
};
