import { TEAM_NAME } from '@/constants';
import { WinOrLose, EventState } from '@/types';
import {
  buttonVariants,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EventResponse,
  SkeletonEventResponse,
} from '@/components';
import { cn, countUsersResponses } from '@/lib';
import { SquarePlay, FileText } from 'lucide-react';
import { useAuth } from '@/contexts';
import { useToast } from '@/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config';

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
  variant?: EventState;
};

const fetchEventResponses = async (eventId: string) => {
  const eventRef = doc(db, 'events', eventId);
  const docSnap = await getDoc(eventRef);

  const response = docSnap.data();
  return response;
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
  id,
}: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const isFuture = variant === 'future';
  const isCurrent = variant === 'current';
  const isPast = variant === 'past';

  const getMatchDisplay = () => {
    if (!result) {
      return isHost
        ? `${TEAM_NAME} ${isPast ? '?:?' : 'vs'} ${opponent}`
        : `${opponent} ${isPast ? '?:?' : 'vs'} ${TEAM_NAME}`;
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

  const {
    data: eventResponses,
    refetch: refetchEventResponses,
    isLoading: eventResponsesLoading,
  } = useQuery({
    enabled: isCurrent,
    queryKey: ['eventResponses'],
    queryFn: () => fetchEventResponses(id),
  });

  const saveResponseMutation = useMutation({
    mutationFn: async (selectedValue: string) => {
      if (!user) return;

      const eventDocRef = doc(db, 'events', id);

      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        await updateDoc(eventDocRef, {
          [user.uid]: selectedValue,
        });
      } else {
        await setDoc(eventDocRef, {
          [user.uid]: selectedValue,
        });
      }
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    },
    onSuccess: () => {
      refetchEventResponses();
    },
  });

  const handleChange = async (value: string) => {
    saveResponseMutation.mutate(value);
  };

  return (
    <Card
      className={cn('text-center', {
        'bg-gray-300/5': isPast,
        'bg-green-400/5': isCurrent,
        'bg-blue-400/5': isFuture,
      })}>
      <CardHeader>
        <CardDescription>
          {date} | {time}
        </CardDescription>
        <CardTitle>{getMatchDisplay()}</CardTitle>
        <CardDescription>зала {hall}</CardDescription>

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

        {isCurrent && !!user ? (
          <>
            {eventResponsesLoading ? (
              <SkeletonEventResponse />
            ) : (
              <EventResponse
                eventId={id}
                onChange={handleChange}
                counter={countUsersResponses(eventResponses)}
                value={eventResponses?.[user!.uid] || ''}
              />
            )}
          </>
        ) : null}
      </CardHeader>
    </Card>
  );
};

export { EventItem };
