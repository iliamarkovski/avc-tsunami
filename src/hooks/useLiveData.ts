import { db } from '@/config';
import { useToast } from '@/hooks/useToast';
import { doc, collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type LiveDataResult<T> = {
  data: T | undefined;
  loading: boolean;
};

export const useLiveData = <T>(collectionName: string, eventId?: string): LiveDataResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!collectionName) {
      console.warn('Invalid collection name provided to useLiveData');
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe: (() => void) | undefined;

    try {
      if (eventId) {
        // Fetch a single document
        const eventDocRef = doc(db, collectionName, eventId);

        unsubscribe = onSnapshot(
          eventDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setData(docSnap.data() as T);
            } else {
              setData(undefined);
            }
            setLoading(false);
          },
          (error) => {
            handleError(error, 'Error fetching single document');
          }
        );
      } else {
        // Fetch the entire collection
        const collectionRef = collection(db, collectionName);
        const collectionQuery = query(collectionRef);

        unsubscribe = onSnapshot(
          collectionQuery,
          (querySnapshot) => {
            const docsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setData(docsData as T);
            setLoading(false);
          },
          (error) => {
            handleError(error, 'Error fetching the entire collection');
          }
        );
      }
    } catch (error) {
      console.error('Unexpected error in useLiveData:', error);
      handleError(error as Error, 'Unexpected error occurred');
    }

    return () => unsubscribe?.();
  }, [collectionName, eventId, toast]);

  const handleError = (error: unknown, message: string) => {
    console.error(message, error);
    toast({
      variant: 'destructive',
      title: 'Error occurred',
      description: 'Please try again later.',
    });
    setLoading(false);
  };

  return { data, loading };
};
