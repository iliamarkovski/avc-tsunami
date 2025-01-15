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
} = {
  TEAMS: 'teams',
  HALLS: 'halls',
  MEMBERS: 'members',
  TRAINING: 'training',
  VOLLEYMANIA: 'volleymania',
  IVL: 'ivl',
  USERS: 'users',
  VERSION: 'version',
} as const;
