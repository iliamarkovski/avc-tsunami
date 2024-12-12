import { fetchData } from '@/api';
import { isAfter } from 'date-fns';

type Props = {
  trainings: {
    id: string;
    date: string;
    defaultHall: boolean;
    hall: {
      name: string | null;
    };
  }[];
};

export const fetchTrainigs = async () => {
  const res = await fetchData<Props>(`{
    trainings(orderBy: date_ASC, first: 100) {
      date
      defaultHall
      hall {
        name
      }
      id
    }
  }`);

  const filteredRes = res?.trainings.filter((event) => {
    return isAfter(new Date(event.date), new Date());
  });

  return filteredRes;
};
