import { db } from '@/config';
import { EventOptions, Roles } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type EventResponse =
  | Record<
      string,
      {
        answer: EventOptions;
        name: string;
        role: Roles;
      }
    >
  | undefined;

export const useLiveEventResponses = (collection: string, eventId: string) => {
  const [eventResponses, setEventResponses] = useState<EventResponse>(undefined);
  const [loading, setLoading] = useState(true);

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
        console.error('Error listening to event responses:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collection, eventId]);

  return { eventResponses, loading };
};
