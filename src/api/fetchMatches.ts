import { fetchData } from '@/api';
import { EventType, WinOrLose } from '@/types';

type Games = 0 | 1 | 2;

export type Event = {
  id: string;
  date: string;
  hostOrGuest: 'host' | 'guest';
  hall: {
    name: string;
  } | null;
  lostGames: Games | null;
  opponent: {
    name: string;
  } | null;
  winOrLose: WinOrLose | null;
  wonGames: Games | null;
  recording: string | null;
  statistics: {
    url: string;
  } | null;
};

export type DataProps = {
  [K in EventType]: Event[];
};

type Props = {
  type: EventType;
};

export const fetchMatches = async ({ type }: Props) => {
  const res = await fetchData<DataProps>(`{
      ${type}(orderBy: date_ASC, first: 100) {
        id
        date
        hostOrGuest
        hall {
          name
        }
        lostGames
        opponent {
          name
        }
        winOrLose
        wonGames
        recording
        statistics {
          url
        }
      }
    }`);

  return res?.[type];
};
