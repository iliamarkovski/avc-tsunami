import { getDateByTimestamp } from './getDateByTimestamp';
import { isBefore, startOfDay } from 'date-fns';

type EventBase = {
  dateTime: Date;
  gamesHost?: string;
  gamesGuest?: string;
};

export const separateEvents = <T extends EventBase>(events: T[]) => {
  const today = startOfDay(new Date());

  // Sort events by time in ascending order
  const sortedEvents = events.sort((a, b) => {
    const dateA = getDateByTimestamp(a.dateTime).getTime();
    const dateB = getDateByTimestamp(b.dateTime).getTime();
    return dateA - dateB;
  });

  const pastEvents: T[] = [];
  const futureEvents: T[] = [];

  sortedEvents.forEach((event) => {
    const eventDay = startOfDay(getDateByTimestamp(event.dateTime));

    if ((event.gamesHost && event.gamesGuest) || isBefore(eventDay, today)) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  return { pastEvents, futureEvents };
};
