import { db } from '@/config';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  addDoc,
  type DocumentData,
  where,
  type WhereFilterOp,
} from 'firebase/firestore';

/**
 * Fetch all documents from a Firestore collection.
 * Returns an empty array if the collection is empty or an error occurs.
 */
type Filter = {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
};

export const getAllDocuments = async <T = DocumentData>(
  collectionName: string,
  filter?: Filter
): Promise<(T & { id: string })[]> => {
  try {
    let q;

    if (filter) {
      q = query(collection(db, collectionName), where(filter.field, filter.operator, filter.value));
    } else {
      q = query(collection(db, collectionName));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as (T & { id: string })[];
  } catch (error) {
    console.error(`Failed to get documents from ${collectionName}:`, error);
    return [];
  }
};

// get all users
// const users = await getAllDocuments<User>("users");

// // get only admins
// const admins = await getAllDocuments<User>("users", {
//   field: "role",
//   operator: "==",
//   value: "admin",
// });

/**
 * Fetch a single document by ID from a Firestore collection.
 * Returns null if the document doesn’t exist or an error occurs.
 */
export const getDocument = async <T = DocumentData>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const response = await getDoc(docRef);
    if (!response.exists()) {
      console.warn(`Document not found in ${collectionName} with ID ${id}`);
      return null;
    }
    return { ...response.data(), id: response.id } as T & { id: string };
  } catch (error) {
    console.error(`Failed to get document with ID ${id} from ${collectionName}:`, error);
    return null;
  }
};

/**
 * Delete a document by ID from a Firestore collection.
 * Returns true if deleted, false if error occurs.
 */
export const deleteDocument = async (collectionName: string, id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Failed to delete document with ID ${id} from ${collectionName}:`, error);
    return false;
  }
};

/**
 * Update a document in a Firestore collection.
 * Returns true if successful, false if error occurs.
 */
export const updateDocument = async <T = DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error(`Failed to update document with ID ${id} in ${collectionName}:`, error);
    return false;
  }
};

/**
 * Add a new document to a Firestore collection.
 * Returns the new document ID or null if error occurs.
 */
export const addDocument = async <T extends Record<string, unknown> = DocumentData>(
  collectionName: string,
  data: T
): Promise<string | null> => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  } catch (error) {
    console.error(`Failed to add document to ${collectionName}:`, error);
    return null;
  }
};

/**
 * Set a document with a custom ID in a Firestore collection.
 * Merge option is defaulted to true. Returns true if successful.
 */
export const setDocument = async <T extends Record<string, unknown> = DocumentData>(
  collectionName: string,
  id: string,
  data: T,
  merge = true
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data, { merge });
    return true;
  } catch (error) {
    console.error(`Failed to set document with ID ${id} in ${collectionName}:`, error);
    return false;
  }
};
