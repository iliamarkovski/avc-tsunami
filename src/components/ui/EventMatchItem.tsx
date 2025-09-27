import { EventItem, IconLink, MatchTitle } from '@/components';
import { SquarePlay, FileText } from 'lucide-react';
import { useData } from '@/contexts';
import { QueryKeys } from '@/types';

export type EventMatchProps = {
  id: string;
  isHost: boolean;
  hall: string;
  gamesHost?: string;
  gamesGuest?: string;
  dateTime: Date;
  opponent: string;
  recordingUrl?: string | null;
  statisticsUrl?: string | null;
  isCurrent?: boolean;
  isFuture?: boolean;
  queryKey: QueryKeys;
  badge?: string;
  message?: string;
};

const EventMatchItem = ({
  id,
  isHost,
  hall,
  gamesHost,
  gamesGuest,
  dateTime,
  opponent,
  recordingUrl,
  statisticsUrl,
  isCurrent,
  queryKey,
  badge,
  message,
  isFuture,
}: EventMatchProps) => {
  const { data } = useData();
  const { loggedInUser } = data;
  const isAdmin = loggedInUser?.isAdmin || loggedInUser?.isSuperAdmin;
  const canSeeStatistics = statisticsUrl && !!loggedInUser && (isAdmin || loggedInUser.isMember);

  return (
    <EventItem
      eventId={id}
      queryKey={queryKey}
      isCurrent={isCurrent}
      dateTime={dateTime}
      title={<MatchTitle isHost={isHost} opponent={opponent} gamesHost={gamesHost} gamesGuest={gamesGuest} />}
      hall={hall}
      badge={badge}
      message={message}
      isFuture={isFuture}>
      {recordingUrl || (statisticsUrl && !!loggedInUser) ? (
        <div className="!mt-6 flex flex-wrap items-center justify-center gap-3">
          {recordingUrl ? <IconLink href={recordingUrl} title="Видео" icon={SquarePlay} /> : null}

          {canSeeStatistics ? <IconLink href={statisticsUrl} title="Статистика" icon={FileText} /> : null}
        </div>
      ) : null}
    </EventItem>
  );
};

export { EventMatchItem };
