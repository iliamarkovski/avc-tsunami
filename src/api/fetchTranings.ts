import { fetchData } from '@/api';

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
    trainings(orderBy: date_ASC) {
      date
      defaultHall
      hall {
        name
      }
      id
    }
  }`);

  return res?.trainings;
};
