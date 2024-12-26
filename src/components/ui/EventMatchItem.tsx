import { buttonVariants, EventItem, MatchTitle } from '@/components';
import { cn } from '@/lib';
import { SquarePlay, FileText } from 'lucide-react';
import { useAuth } from '@/contexts';

export type EventMatch = {
  id: string;
  isHost: boolean;
  hall: string;
  gamesHost?: string;
  gamesGuest?: string;
  date: Date;
  opponent: string;
  recordingUrl?: string | null;
  statisticsUrl?: string | null;
  isCurrent?: boolean;
  collection: string;
};

const EventMatchItem = ({
  id,
  isHost,
  hall,
  gamesHost,
  gamesGuest,
  date,
  opponent,
  recordingUrl,
  statisticsUrl,
  isCurrent,
  collection,
}: EventMatch) => {
  const { user } = useAuth();

  return (
    <EventItem
      eventId={id}
      collection={collection}
      isCurrent={isCurrent}
      date={date}
      title={<MatchTitle isHost={isHost} opponent={opponent} gamesHost={gamesHost} gamesGuest={gamesGuest} />}
      hall={hall}>
      {recordingUrl || (statisticsUrl && !!user) ? (
        <div className="!mt-6 flex flex-wrap items-center justify-center gap-3">
          {recordingUrl ? (
            <a href={recordingUrl} target="_blank" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              <SquarePlay className="text-red-600" /> Видео
            </a>
          ) : null}

          {statisticsUrl && !!user ? (
            <a href={statisticsUrl} target="_blank" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              <FileText className="text-red-600" /> Статистика
            </a>
          ) : null}
        </div>
      ) : null}
    </EventItem>
  );
};

export { EventMatchItem };
