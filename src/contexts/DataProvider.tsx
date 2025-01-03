import { Matches, Members, Names, Training } from '@/components';
import { QUERY_KEYS } from '@/constants';
import { useLiveData } from '@/hooks';
import { getDateByTimestamp } from '@/lib';
import { createContext, ReactNode, useContext, useMemo } from 'react';

type Props = {
  isLoading: boolean;
  data: {
    teams: Names[];
    halls: Names[];
    members: Members[];
    training: Training[];
    ivl: Matches[];
    volleymania: Matches[];
    users: any;
  };
};

const DataContext = createContext<Props | undefined>(undefined);

const DataProvider = ({ children }: { children: ReactNode }) => {
  const { data: teams, loading: teamsLoading } = useLiveData<Names[]>(QUERY_KEYS.TEAMS);
  const { data: halls, loading: hallsLoading } = useLiveData<Names[]>(QUERY_KEYS.HALLS);
  const { data: members, loading: membersLoading } = useLiveData<Members[]>(QUERY_KEYS.MEMBERS);
  const { data: training, loading: trainingLoading } = useLiveData<Training[]>(QUERY_KEYS.TRAINING);
  const { data: ivl, loading: ivlLoading } = useLiveData<Matches[]>(QUERY_KEYS.IVL);
  const { data: volleymania, loading: volleymaniaLoading } = useLiveData<Matches[]>(QUERY_KEYS.VOLLEYMANIA);

  const sortedTeams = useMemo(() => {
    if (!teams) return [];
    return [...teams].sort((a, b) => a.name.localeCompare(b.name));
  }, [teams]);

  const sortedHalls = useMemo(() => {
    if (!halls) return [];
    return [...halls].sort((a, b) => a.name.localeCompare(b.name));
  }, [halls]);

  const sortedMembers = useMemo(() => {
    if (!members) return [];
    return [...members].sort((a, b) => Number(a.number) - Number(b.number));
  }, [members]);

  const sortedTraining = useMemo(() => {
    if (!training) return [];
    return [...training].sort(
      (a, b) => getDateByTimestamp(a.dateTime).getTime() - getDateByTimestamp(b.dateTime).getTime()
    );
  }, [training]);

  const sortedIvl = useMemo(() => {
    if (!ivl) return [];
    return [...ivl].sort((a, b) => getDateByTimestamp(b.dateTime).getTime() - getDateByTimestamp(a.dateTime).getTime());
  }, [ivl]);

  const sortedVolleyMania = useMemo(() => {
    if (!volleymania) return [];
    return [...volleymania].sort(
      (a, b) => getDateByTimestamp(b.dateTime).getTime() - getDateByTimestamp(a.dateTime).getTime()
    );
  }, [volleymania]);

  return (
    <DataContext.Provider
      value={{
        isLoading:
          ivlLoading || volleymaniaLoading || teamsLoading || hallsLoading || membersLoading || trainingLoading,
        data: {
          halls: sortedHalls,
          teams: sortedTeams,
          members: sortedMembers,
          training: sortedTraining,
          ivl: sortedIvl,
          volleymania: sortedVolleyMania,
          users: [],
        },
      }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = (): Props => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { DataProvider, useData };
