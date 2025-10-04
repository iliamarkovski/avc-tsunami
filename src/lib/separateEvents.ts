import { getDateByTimestamp } from './getDateByTimestamp';
import { isBefore, startOfToday, startOfDay } from 'date-fns';

type EventBase = {
  dateTime: Date;
  gamesHost?: string;
  gamesGuest?: string;
};

export const separateEvents = <T extends EventBase>(events: T[]) => {
  const today = startOfToday();

  const pastEvents: T[] = [];
  const futureEvents: T[] = [];

  events.forEach((event) => {
    const eventTime = startOfDay(getDateByTimestamp(event.dateTime)); // compare by date only

    if (isBefore(eventTime, today)) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  return { pastEvents, futureEvents };
};
