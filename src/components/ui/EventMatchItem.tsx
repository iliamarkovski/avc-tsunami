import { TEAM_NAME } from '@/constants';
import { WinOrLose, EventState, EventOptions, Roles } from '@/types';
import {
  buttonVariants,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EventResponse,
  SkeletonEventResponse,
} from '@/components';
import { cn, getUsersByResponse } from '@/lib';
import { SquarePlay, FileText } from 'lucide-react';
import { useAuth } from '@/contexts';
import { useToast } from '@/hooks';
import { useMutation } from '@tanstack/react-query';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config';
import { useEffect, useState } from 'react';

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

const useLiveEventResponses = (eventId: string) => {
  const [eventResponses, setEventResponses] = useState<
    Record<string, { answer: EventOptions; name: string; role: Roles }> | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventDocRef = doc(db, 'matches', eventId);

    const unsubscribe = onSnapshot(
      eventDocRef,
      (docSnap) => {
        setEventResponses(docSnap.exists() ? docSnap.data() : undefined);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to event responses:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [eventId]);

  return { eventResponses, loading };
};

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
  variant,
  id,
}: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { eventResponses, loading: eventResponsesLoading } = useLiveEventResponses(id);

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

  const saveResponseMutation = useMutation({
    mutationFn: async (selectedValue: string) => {
      if (!user) return;

      const eventDocRef = doc(db, 'matches', id);

      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        await updateDoc(eventDocRef, {
          [user.uid]: { answer: selectedValue, name: user.name, role: user.role },
        });
      } else {
        await setDoc(eventDocRef, {
          [user.uid]: { answer: selectedValue, name: user.name, role: user.role },
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
  });

  const handleChange = async (value: string) => {
    saveResponseMutation.mutate(value);
  };

  return (
    <Card
      className={cn('text-center', {
        'bg-gray-400/5': isPast,
        'bg-green-400/10': isCurrent,
        'bg-blue-400/10': isFuture,
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

        {(isCurrent || isFuture) && !!user ? (
          <>
            {eventResponsesLoading ? (
              <SkeletonEventResponse />
            ) : (
              <EventResponse
                onChange={handleChange}
                data={getUsersByResponse(eventResponses)}
                selectedValue={eventResponses?.[user!.uid]?.answer || ''}
              />
            )}
          </>
        ) : null}
      </CardHeader>
    </Card>
  );
};

export { EventMatchItem };
