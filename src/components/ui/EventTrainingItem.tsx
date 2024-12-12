import { EventOptions, EventState, Roles } from '@/types';
import { Card, CardDescription, CardHeader, CardTitle, EventResponse, SkeletonEventResponse } from '@/components';
import { cn, getUsersByResponse } from '@/lib';
import { useAuth } from '@/contexts';
import { useToast } from '@/hooks';
import { useMutation } from '@tanstack/react-query';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config';
import { useEffect, useState } from 'react';

type Props = {
  id: string;
  hall: string;
  date: string;
  time: string;
  variant?: Omit<EventState, 'past'>;
};

const useLiveEventResponses = (eventId: string) => {
  const [eventResponses, setEventResponses] = useState<
    Record<string, { answer: EventOptions; name: string; role: Roles }> | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventDocRef = doc(db, 'trainings', eventId);

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

const EventTrainingItem = ({ hall, date, time, id, variant }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { eventResponses, loading: eventResponsesLoading } = useLiveEventResponses(id);

  const isFuture = variant === 'future';
  const isCurrent = variant === 'current';

  const saveResponseMutation = useMutation({
    mutationFn: async (selectedValue: string) => {
      if (!user) return;

      const eventDocRef = doc(db, 'trainings', id);

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
        'bg-green-400/10': isCurrent,
        'bg-blue-400/10': isFuture,
      })}>
      <CardHeader>
        <CardDescription>
          {date} | {time}
        </CardDescription>
        <CardTitle>Тренировка</CardTitle>
        <CardDescription>зала {hall}</CardDescription>

        {eventResponsesLoading ? (
          <SkeletonEventResponse />
        ) : (
          <EventResponse
            onChange={handleChange}
            data={getUsersByResponse(eventResponses)}
            selectedValue={eventResponses?.[user!.uid]?.answer || ''}
          />
        )}
      </CardHeader>
    </Card>
  );
};

export { EventTrainingItem };
