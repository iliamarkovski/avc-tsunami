import { QUERY_KEYS } from '@/constants/queryKeys';
import { QueryKeys } from '@/types';

type Tabs = {
  title: string;
  value: QueryKeys;
}[];

export const EVENT_LABELS: Tabs = [
  {
    title: 'Volley Mania',
    value: QUERY_KEYS.VOLLEYMANIA,
  },
  {
    title: 'IVL',
    value: QUERY_KEYS.IVL,
  },
  {
    title: 'Тренировка',
    value: QUERY_KEYS.TRAINING,
  },
];
