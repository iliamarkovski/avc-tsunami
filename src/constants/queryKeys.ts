import { QueryKeys } from '@/types';

export const QUERY_KEYS: {
  TEAMS: QueryKeys;
  HALLS: QueryKeys;
  MEMBERS: QueryKeys;
  TRAINING: QueryKeys;
  VOLLEYMANIA: QueryKeys;
  IVL: QueryKeys;
  USERS: QueryKeys;
  VERSION: QueryKeys;
  SEASONS_VOLLEYMANIA: QueryKeys;
  SEASONS_IVL: QueryKeys;
} = {
  TEAMS: 'teams',
  HALLS: 'halls',
  MEMBERS: 'members',
  TRAINING: 'training',
  VOLLEYMANIA: 'volleymania',
  IVL: 'ivl',
  USERS: 'users',
  VERSION: 'version',
  SEASONS_VOLLEYMANIA: 'seasonsVolleymania',
  SEASONS_IVL: 'seasonsIvl',
} as const;
