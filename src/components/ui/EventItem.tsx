import { Card, CardHeader, EventResponse, SkeletonEventItem } from '@/components';
import { db } from '@/config';
import { useAuth } from '@/contexts';
import { useLiveEventResponses, useToast } from '@/hooks';
import { cn, getUsersByResponse } from '@/lib';
import { useMutation } from '@tanstack/react-query';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ReactNode } from 'react';

type Props = {
  isCurrent?: boolean;
  children: ReactNode;
  collection: string;
  eventId: string;
};

const EventItem = ({ isCurrent, children, collection, eventId }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { eventResponses, loading: eventResponsesLoading } = useLiveEventResponses(collection, eventId);

  const answer = eventResponses?.[user!.uid]?.answer;

  const saveResponseMutation = useMutation({
    mutationFn: async (selectedValue: string) => {
      if (!user) return;

      const eventDocRef = doc(db, collection, eventId);

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

  if (eventResponsesLoading) {
    return <SkeletonEventItem isCurrent={isCurrent} />;
  }

  return (
    <Card
      className={cn('text-center', {
        'bg-border': isCurrent && !answer,
        'bg-green-400/10': isCurrent && answer === 'yes',
        'bg-red-400/10': isCurrent && answer === 'no',
      })}>
      <CardHeader>
        {children}

        {isCurrent && !!user ? (
          <EventResponse
            onChange={handleChange}
            data={getUsersByResponse(eventResponses)}
            selectedValue={eventResponses?.[user!.uid]?.answer || ''}
          />
        ) : null}
      </CardHeader>
    </Card>
  );
};

export { EventItem };
