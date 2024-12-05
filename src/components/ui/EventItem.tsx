import { TEAM_NAME } from '@/constants';
import { WinOrLose, EventState } from '@/types';
import { buttonVariants, Card, CardDescription, CardHeader, CardTitle } from '@/components';
import { cn } from '@/lib';
import { SquarePlay, FileText } from 'lucide-react';
import { useAuth } from '@/contexts';

type Props = {
  isHost: boolean;
  result: WinOrLose | null;
  games: 0 | 1 | 2 | null;
  hall: string;
  date: string;
  time: string;
  opponent: string;
  recordingUrl: string | null;
  statisticsUrl: string | null;
  variant?: EventState;
};

const EventItem = ({
  isHost,
  result,
  games,
  hall,
  date,
  time,
  opponent,
  recordingUrl,
  statisticsUrl,
  variant,
}: Props) => {
  const { user } = useAuth();

  const getMatchDisplay = () => {
    if (!result) {
      return isHost
        ? `${TEAM_NAME} ${variant === 'past' ? '?:?' : 'vs'} ${opponent}`
        : `${opponent} ${variant === 'past' ? '?:?' : 'vs'} ${TEAM_NAME}`;
    }
    if (result === 'win') {
      return isHost ? (
        <>
          {TEAM_NAME} <span className="text-green-500">3:{games ?? '-'}</span> {opponent}
        </>
      ) : (
        <>
          {opponent} <span className="text-green-500">{games ?? '-'}:3</span> {TEAM_NAME}
        </>
      );
    }
    if (result === 'lose') {
      return isHost ? (
        <>
          {TEAM_NAME} <span className="text-red-500">{games ?? '-'}:3</span> {opponent}
        </>
      ) : (
        <>
          {opponent} <span className="text-red-500">3:{games ?? '-'}</span> {TEAM_NAME}
        </>
      );
    }
  };

  return (
    <Card
      className={cn('text-center', {
        'bg-white': variant === 'past',
        'bg-green-400/5': variant === 'current',
        'bg-blue-400/5': variant === 'future',
      })}>
      <CardHeader>
        <CardDescription>
          {date} | {time}
        </CardDescription>
        <CardTitle>{getMatchDisplay()}</CardTitle>
        <CardDescription>{hall}</CardDescription>

        {recordingUrl || (statisticsUrl && !!user) ? (
          <div className="!mt-6 flex flex-wrap items-center justify-center gap-3">
            {recordingUrl ? (
              <a href={recordingUrl} target="_blank" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                <SquarePlay className="text-[#FF0000]" /> Видео
              </a>
            ) : null}

            {statisticsUrl && !!user ? (
              <a
                href={statisticsUrl}
                target="_blank"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                <FileText className="text-[#FF0000]" /> Статистика
              </a>
            ) : null}
          </div>
        ) : null}
      </CardHeader>
    </Card>
  );
};

export { EventItem };
