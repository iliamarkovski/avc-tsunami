import { db } from '@/config';
import { useToast } from '@/hooks/useToast';
import { doc, collection, onSnapshot, query, where, type WhereFilterOp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export type Filter = {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
};

type LiveDataResult<T> = {
  data: T | undefined;
  loading: boolean;
};

/**
 * Live listener hook for Firestore collections or single documents
 * @param collectionName Firestore collection name
 * @param eventId Optional document ID (fetches a single doc if provided)
 * @param filter Optional filter object (applies only to collection queries)
 */
export const useLiveData = <T>(collectionName: string, eventId?: string, filter?: Filter): LiveDataResult<T> => {
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
        // ✅ Single document listener
        const eventDocRef = doc(db, collectionName, eventId);

        unsubscribe = onSnapshot(
          eventDocRef,
          (docSnap) => {
            setData(docSnap.exists() ? (docSnap.data() as T) : undefined);
            setLoading(false);
          },
          (error) => handleError(error, 'Error fetching single document')
        );
      } else {
        // ✅ Collection listener (with optional filter)
        const collectionRef = collection(db, collectionName);
        const q = filter
          ? query(collectionRef, where(filter.field, filter.operator, filter.value))
          : query(collectionRef);

        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const docsData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setData(docsData as T);
            setLoading(false);
          },
          (error) => handleError(error, 'Error fetching collection')
        );
      }
    } catch (error) {
      console.error('Unexpected error in useLiveData:', error);
      handleError(error as Error, 'Unexpected error occurred');
    }

    return () => {
      unsubscribe?.();
    };
  }, [collectionName, eventId, filter?.field, filter?.operator, filter?.value, toast]);

  const handleError = (error: unknown, message: string) => {
    console.error(message, error);
    toast({
      variant: 'destructive',
      title: 'Възникна грешка',
      description: 'Моля, опитайте отново по-късно.',
    });
    setLoading(false);
  };

  return { data, loading };
};
