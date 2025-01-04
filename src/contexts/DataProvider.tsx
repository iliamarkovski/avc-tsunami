import { Matches, Members, Names, Training } from '@/components';
import { QUERY_KEYS } from '@/constants';
import { useLiveData } from '@/hooks';
import { getDateByTimestamp } from '@/lib';
import { createContext, ReactNode, useContext, useMemo } from 'react';

type Users = {
  customName: string | null;
  email: string;
  memberId: string | null;
  role: string | null;
  id: string;
}[];

type SortedData = {
  teams: Names[];
  halls: Names[];
  members: Members[];
  training: Training[];
  ivl: Matches[];
  volleymania: Matches[];
  users: Users;
};

type ContextProps = {
  isLoading: boolean;
  data: SortedData;
};

const defaultData: SortedData = {
  teams: [],
  halls: [],
  members: [],
  training: [],
  ivl: [],
  volleymania: [],
  users: [],
};

const DataContext = createContext<ContextProps | undefined>(undefined);

const DataProvider = ({ children }: { children: ReactNode }) => {
  const { data: teams, loading: teamsLoading } = useLiveData<Names[]>(QUERY_KEYS.TEAMS);
  const { data: halls, loading: hallsLoading } = useLiveData<Names[]>(QUERY_KEYS.HALLS);
  const { data: members, loading: membersLoading } = useLiveData<Members[]>(QUERY_KEYS.MEMBERS);
  const { data: training, loading: trainingLoading } = useLiveData<Training[]>(QUERY_KEYS.TRAINING);
  const { data: ivl, loading: ivlLoading } = useLiveData<Matches[]>(QUERY_KEYS.IVL);
  const { data: volleymania, loading: volleymaniaLoading } = useLiveData<Matches[]>(QUERY_KEYS.VOLLEYMANIA);
  const { data: users, loading: usersLoading } = useLiveData<Users>(QUERY_KEYS.USERS);

  const sortedData = useMemo(
    () => ({
      teams: [...(teams ?? defaultData.teams)].sort((a, b) => a.name.localeCompare(b.name)),
      halls: [...(halls ?? defaultData.halls)].sort((a, b) => a.name.localeCompare(b.name)),
      members: [...(members ?? defaultData.members)].sort((a, b) => Number(a.number) - Number(b.number)),
      training: [...(training ?? defaultData.training)].sort(
        (a, b) => getDateByTimestamp(a.dateTime).getTime() - getDateByTimestamp(b.dateTime).getTime()
      ),
      ivl: [...(ivl ?? defaultData.ivl)].sort(
        (a, b) => getDateByTimestamp(a.dateTime).getTime() - getDateByTimestamp(b.dateTime).getTime()
      ),
      volleymania: [...(volleymania ?? defaultData.volleymania)].sort(
        (a, b) => getDateByTimestamp(a.dateTime).getTime() - getDateByTimestamp(b.dateTime).getTime()
      ),
      users: [...(users ?? defaultData.users)].sort((a, b) => a.email?.localeCompare(b?.email)),
    }),
    [teams, halls, members, training, ivl, volleymania, users]
  );

  const isLoading = [
    teamsLoading,
    hallsLoading,
    membersLoading,
    trainingLoading,
    ivlLoading,
    volleymaniaLoading,
    usersLoading,
  ].some(Boolean);

  return <DataContext.Provider value={{ isLoading, data: sortedData }}>{children}</DataContext.Provider>;
};

const useData = (): ContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { DataProvider, useData };
