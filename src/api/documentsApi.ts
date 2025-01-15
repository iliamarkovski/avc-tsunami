import { db } from '@/config';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  DocumentData,
  setDoc,
  updateDoc,
  addDoc,
} from 'firebase/firestore';

/**
 * Fetch all documents from a Firestore collection.
 * @param collectionName - Name of the Firestore collection.
 * @returns An array of documents with their IDs.
 */
export const fetchAllDocuments = async <T = DocumentData>(collectionName: string): Promise<(T & { id: string })[]> => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as (T & { id: string })[];
  } catch (error) {
    console.error(`Failed to fetch documents from ${collectionName}:`, error);
    throw new Error('Failed to fetch documents.');
  }
};

/**
 * Fetch a single document by ID from a Firestore collection.
 * @param collectionName - Name of the Firestore collection.
 * @param id - Document ID to fetch.
 * @returns The document data with its ID.
 */
export const fetchDocument = async <T = DocumentData>(
  collectionName: string,
  id: string
): Promise<T & { id: string }> => {
  try {
    const docRef = doc(db, collectionName, id);
    const response = await getDoc(docRef);

    if (response.exists()) {
      return { ...response.data(), id: response.id } as T & { id: string };
    } else {
      throw new Error(`Document not found in ${collectionName} with ID ${id}`);
    }
  } catch (error) {
    console.error(`Failed to fetch document with ID ${id} from ${collectionName}:`, error);
    throw new Error('Failed to fetch document.');
  }
};

/**
 * Delete a document by ID from a Firestore collection.
 * @param collectionName - Name of the Firestore collection.
 * @param id - Document ID to delete.
 */
export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Failed to delete document with ID ${id} from ${collectionName}:`, error);
    throw new Error('Failed to delete document.');
  }
};

/**
 * Update a document in a Firestore collection.
 * @param collectionName - Name of the Firestore collection.
 * @param id - Document ID to update.
 * @param data - Data to update the document with.
 */
export const updateDocument = async (
  collectionName: string,
  id: string,
  data: Partial<DocumentData>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Failed to update document with ID ${id} in ${collectionName}:`, error);
    throw new Error('Failed to update document.');
  }
};

/**
 * Add a document to a Firestore collection.
 * @param collectionName - Name of the Firestore collection.
 * @param data - Data to add to the document.
 */
export const addDocument = async (collectionName: string, data: Partial<DocumentData>): Promise<void> => {
  try {
    const collectionRef = collection(db, collectionName);
    await addDoc(collectionRef, data);
  } catch (error) {
    console.error(`Failed to add document to ${collectionName}:`, error);
    throw new Error('Failed to add document.');
  }
};

/**
 * Set a document with a custom ID in a Firestore collection.
 * @param collectionName - Name of the Firestore collection.
 * @param id - Document ID to set.
 * @param data - Data to set in the document.
 */
export const setDocument = async (collectionName: string, id: string, data: Partial<DocumentData>): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data);
  } catch (error) {
    console.error(`Failed to set document with ID ${id} in ${collectionName}:`, error);
    throw new Error('Failed to set document.');
  }
};
