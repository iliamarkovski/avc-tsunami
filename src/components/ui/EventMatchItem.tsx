import { TEAM_NAME } from '@/constants';
import { EventType, WinOrLose } from '@/types';
import { buttonVariants, EventItem } from '@/components';
import { cn } from '@/lib';
import { SquarePlay, FileText } from 'lucide-react';
import { useAuth } from '@/contexts';
import { ReactNode } from 'react';

type Props = {
  id: string;
  isHost: boolean;
  result: WinOrLose | null;
  games: 0 | 1 | 2 | null;
  hall: string;
  date: string;
  opponent: string;
  recordingUrl: string | null;
  statisticsUrl: string | null;
  isCurrent?: boolean;
  eventType: EventType;
};

const COLLECTION = 'matches';

const EventMatchItem = ({
  isHost,
  result,
  games,
  hall,
  date,
  opponent,
  recordingUrl,
  statisticsUrl,
  isCurrent,
  id,
  eventType,
}: Props) => {
  const { user } = useAuth();

  const getMatchDisplay = (): string | ReactNode => {
    if (!result) {
      return isHost ? `${TEAM_NAME} vs ${opponent}` : `${opponent} vs ${TEAM_NAME}`;
    }
    if (result === 'win') {
      return isHost ? (
        <>
          {TEAM_NAME} <span className="text-green-600">3:{games ?? '?'}</span> {opponent}
        </>
      ) : (
        <>
          {opponent} <span className="text-green-600">{games ?? '?'}:3</span> {TEAM_NAME}
        </>
      );
    }
    if (result === 'lose') {
      return isHost ? (
        <>
          {TEAM_NAME} <span className="text-red-600">{games ?? '?'}:3</span> {opponent}
        </>
      ) : (
        <>
          {opponent} <span className="text-red-600">3:{games ?? '?'}</span> {TEAM_NAME}
        </>
      );
    }

    return '';
  };

  return (
    <EventItem
      eventId={id}
      collection={COLLECTION}
      isCurrent={isCurrent}
      date={date}
      title={getMatchDisplay()}
      hall={hall}
      eventType={eventType}>
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
