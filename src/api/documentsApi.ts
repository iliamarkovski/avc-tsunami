import { db } from '@/config';
import { collection, deleteDoc, doc, getDoc, getDocs, query } from 'firebase/firestore';

export const fetchAllDocuments = async <T>(collectionName: string): Promise<(T & { id: string })[]> => {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  const response = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as (T & { id: string })[];
  return response;
};

export const fetchDocument = async <T>(collectionName: string, id: string): Promise<T & { id: string }> => {
  const docRef = doc(db, collectionName, id);
  const response = await getDoc(docRef);

  if (response.exists()) {
    return { ...response.data(), id: response.id } as T & { id: string };
  } else {
    throw new Error('Item not found');
  }
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};
