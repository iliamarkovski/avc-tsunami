import { Timestamp } from 'firebase/firestore';
export const getDateByTimestamp = (date: Date) => {
  return (date as unknown as Timestamp).toDate();
};
