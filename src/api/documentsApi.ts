import { db } from '@/config';
import { collection, deleteDoc, doc, DocumentData, setDoc, updateDoc, addDoc } from 'firebase/firestore';

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
