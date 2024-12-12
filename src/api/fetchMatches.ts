import { fetchData } from '@/api';
import { EventType, WinOrLose } from '@/types';

type Games = 0 | 1 | 2 | null;

export type Event = {
  id: string;
  date: string;
  hostOrGuest: 'host' | 'guest';
  hall: {
    name: string;
  };
  lostGames: Games;
  opponent: {
    name: string;
  };
  winOrLose: WinOrLose;
  wonGames: Games;
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
      ${type}(orderBy: date_ASC) {
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
