import { TEAM_NAME } from '@/constants';
import { WinOrLose } from '@/types';
import { buttonVariants, CardDescription, CardTitle, EventItem } from '@/components';
import { cn } from '@/lib';
import { SquarePlay, FileText } from 'lucide-react';
import { useAuth } from '@/contexts';

type Props = {
  id: string;
  isHost: boolean;
  result: WinOrLose | null;
  games: 0 | 1 | 2 | null;
  hall: string;
  date: string;
  time: string;
  opponent: string;
  recordingUrl: string | null;
  statisticsUrl: string | null;
  isCurrent?: boolean;
};

const COLLECTION = 'matches';

const EventMatchItem = ({
  isHost,
  result,
  games,
  hall,
  date,
  time,
  opponent,
  recordingUrl,
  statisticsUrl,
  isCurrent,
  id,
}: Props) => {
  const { user } = useAuth();

  const getMatchDisplay = () => {
    if (!result) {
      return isHost ? `${TEAM_NAME} / ${opponent}` : `${opponent} / ${TEAM_NAME}`;
    }
    if (result === 'win') {
      return isHost ? (
        <>
          {TEAM_NAME} <span className="text-green-600">3:{games ?? '-'}</span> {opponent}
        </>
      ) : (
        <>
          {opponent} <span className="text-green-600">{games ?? '-'}:3</span> {TEAM_NAME}
        </>
      );
    }
    if (result === 'lose') {
      return isHost ? (
        <>
          {TEAM_NAME} <span className="text-red-600">{games ?? '-'}:3</span> {opponent}
        </>
      ) : (
        <>
          {opponent} <span className="text-red-600">3:{games ?? '-'}</span> {TEAM_NAME}
        </>
      );
    }
  };

  return (
    <EventItem eventId={id} collection={COLLECTION} isCurrent={isCurrent}>
      <CardDescription>
        {date} | {time}
      </CardDescription>
      <CardTitle>{getMatchDisplay()}</CardTitle>
      <CardDescription>зала {hall}</CardDescription>

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
