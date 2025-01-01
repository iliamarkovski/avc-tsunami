import { Matches, Members, Names, Training } from '@/components';
import { QUERY_KEYS } from '@/constants';
import { useLiveData } from '@/hooks';
import { createContext, ReactNode, useContext } from 'react';

type Props = {
  isLoading: boolean;
  data: {
    teams: Names[] | undefined;
    halls: Names[] | undefined;
    members: Members[] | undefined;
    training: Training[] | undefined;
    ivl: Matches[] | undefined;
    volleymania: Matches[] | undefined;
    users: any | undefined;
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

  return (
    <DataContext.Provider
      value={{
        isLoading:
          ivlLoading || volleymaniaLoading || teamsLoading || hallsLoading || membersLoading || trainingLoading,
        data: {
          halls,
          teams,
          members,
          training,
          ivl,
          volleymania,
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
