import { db } from '@/config';
import { useToast } from '@/hooks/useToast';
import { EventOptions, Roles } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type EventResponse = {
  responses?: Record<
    string,
    {
      answer: EventOptions;
      name: string;
      role: Roles;
    }
  >;
};

export const useLiveEventResponses = (collection: string, eventId: string) => {
  const [eventResponses, setEventResponses] = useState<EventResponse | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!eventId) {
      console.warn('Invalid eventId provided to useLiveEventResponses');
      setLoading(false);
      return;
    }

    const eventDocRef = doc(db, collection, eventId);

    const unsubscribe = onSnapshot(
      eventDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setEventResponses(docSnap.data() as EventResponse);
        } else {
          setEventResponses(undefined);
        }
        setLoading(false);
      },
      (error) => {
        console.error('error: ', error);
        toast({
          variant: 'destructive',
          title: 'Възникна грешка',
          description: 'Моля, опитайте отново по-късно.',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collection, eventId]);

  return { eventResponses, loading };
};
