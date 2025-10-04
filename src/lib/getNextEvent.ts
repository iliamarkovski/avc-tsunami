import { getDateByTimestamp } from './getDateByTimestamp';
import { isBefore, startOfToday, startOfDay, compareAsc } from 'date-fns';

type EventBase = {
  dateTime: Date;
};

export const getNextEvent = <T extends EventBase>(events: T[]): T | null => {
  const today = startOfToday();

  // Filter only future events (including today)
  const futureEvents = events.filter((event) => {
    const eventTime = startOfDay(getDateByTimestamp(event.dateTime)); // compare by date only
    return !isBefore(eventTime, today);
  });

  // Sort future events by date ascending
  futureEvents.sort((a, b) => compareAsc(getDateByTimestamp(a.dateTime), getDateByTimestamp(b.dateTime)));

  // Return the closest future event or null
  return futureEvents[0] ?? null;
};
