import { fetchData } from '@/api/fetchData';

type Props = 'volleyMania' | 'ivl' | 'friendly';

type DataProps = {
  [K in Props]: {
    id: string;
    date: string;
    team: {
      name: string;
    };
    hall: {
      name: string;
    };
    hostOrGuest: 'host' | 'guest';
  }[];
};

export const fetchMatchesSchedule = async (type: Props) => {
  const res = await fetchData<DataProps>(`{
      ${type} {
        id
        date
        team {
          name
        }
        hall {
          name
        }
        hostOrGuest
      }
    }`);

  return res?.[type];
};
