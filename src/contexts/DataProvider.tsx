import { Matches, Members, Names, Training, Version } from '@/components';
import { QUERY_KEYS } from '@/constants';
import { useAuth } from '@/contexts';
import { Filter, useLiveData } from '@/hooks';
import { getDateByTimestamp } from '@/lib';
import { Roles } from '@/types';
import { Timestamp } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useMemo } from 'react';

type Users = {
  customName: string | null;
  email: string;
  memberId: string | null;
  role: string | null;
  id: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  modifiedAt: Timestamp | null;
  image?: string | null;
}[];

export type EnrichedUser = {
  id: string;
  memberId: string;
  email: string;
  names: string;
  role: Roles;
  isActive: boolean;
  isMember: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  modifiedAt: Timestamp;
  image?: string | null;
};

type SortedData = {
  teams: Names[];
  halls: Names[];
  members: Members[];
  training: Training[];
  ivl: Matches[];
  volleymania: Matches[];
  users: EnrichedUser[];
  version: { version: string; id: string } | undefined;
  loggedInUser: EnrichedUser | undefined;
  seasonsVolleymania: Names[];
  seasonsIvl: Names[];
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
  version: undefined,
  loggedInUser: undefined,
  seasonsVolleymania: [],
  seasonsIvl: [],
};

const DataContext = createContext<ContextProps | undefined>(undefined);

const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dateFilter: Filter = useMemo(
    () => ({
      field: 'dateTime',
      operator: '>=',
      value: todayStart,
    }),
    [todayStart]
  );

  const { data: teams, loading: teamsLoading } = useLiveData<Names[]>(QUERY_KEYS.TEAMS);
  const { data: halls, loading: hallsLoading } = useLiveData<Names[]>(QUERY_KEYS.HALLS);
  const { data: members, loading: membersLoading } = useLiveData<Members[]>(QUERY_KEYS.MEMBERS);
  const { data: training, loading: trainingLoading } = useLiveData<Training[]>(
    QUERY_KEYS.TRAINING,
    undefined,
    dateFilter
  );
  const { data: ivl, loading: ivlLoading } = useLiveData<Matches[]>(QUERY_KEYS.IVL, undefined, dateFilter);
  const { data: volleymania, loading: volleymaniaLoading } = useLiveData<Matches[]>(
    QUERY_KEYS.VOLLEYMANIA,
    undefined,
    dateFilter
  );
  const { data: users, loading: usersLoading } = useLiveData<Users>(QUERY_KEYS.USERS);
  const { data: version, loading: versionLoading } = useLiveData<Version[]>(QUERY_KEYS.VERSION);
  const { data: seasonsVolleymania, loading: seasonsVolleymaniaLoading } = useLiveData<Names[]>(
    QUERY_KEYS.SEASONS_VOLLEYMANIA
  );
  const { data: seasonsIvl, loading: seasonsIvlLoading } = useLiveData<Names[]>(QUERY_KEYS.SEASONS_IVL);

  const enrichedUsers = useMemo(() => {
    if (!users?.length || !members?.length) return [];

    const memberMap = new Map(members.map((m) => [m.id, m]));

    return users.map((u) => {
      const member = memberMap.get(u.memberId!);

      return {
        id: u.id,
        memberId: u.memberId,
        email: u.email,
        names: member ? member.names : u.customName || '',
        role: (member?.role || u.role) as Roles,
        isActive: member?.active || false,
        isMember: !!member,
        isAdmin: u.isAdmin,
        isSuperAdmin: u.isSuperAdmin,
        modifiedAt: u.modifiedAt,
        image: member?.image || null,
      } as EnrichedUser;
    });
  }, [users, members]);

  const loggedInUser = useMemo(() => {
    if (!enrichedUsers?.length) return undefined;

    return enrichedUsers?.find((enrichedUser) => enrichedUser.id === user?.id);
  }, [enrichedUsers, user]);

  const sortedData = useMemo(() => {
    return {
      teams: [...(teams ?? defaultData.teams)].sort((a, b) => a.name.localeCompare(b.name)),
      halls: [...(halls ?? defaultData.halls)].sort((a, b) => a.name.localeCompare(b.name)),
      members: [...(members ?? defaultData.members)].sort((a, b) => a.names.localeCompare(b.names)),
      training: [...(training ?? defaultData.training)].sort(
        (a, b) => getDateByTimestamp(a.dateTime).getTime() - getDateByTimestamp(b.dateTime).getTime()
      ),
      ivl: [...(ivl ?? defaultData.ivl)].sort(
        (a, b) => getDateByTimestamp(a.dateTime).getTime() - getDateByTimestamp(b.dateTime).getTime()
      ),
      volleymania: [...(volleymania ?? defaultData.volleymania)].sort(
        (a, b) => getDateByTimestamp(a.dateTime).getTime() - getDateByTimestamp(b.dateTime).getTime()
      ),
      users: [...enrichedUsers].sort((a, b) => a.names?.localeCompare(b.names)),
      version: version && version.length > 0 ? { id: version[0].id!, version: version[0].version } : undefined,
      loggedInUser,
      seasonsVolleymania: [...(seasonsVolleymania ?? defaultData.seasonsVolleymania)].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      seasonsIvl: [...(seasonsIvl ?? defaultData.seasonsIvl)].sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [teams, halls, members, training, ivl, volleymania, enrichedUsers, version, loggedInUser]);

  const isLoading = [
    teamsLoading,
    hallsLoading,
    membersLoading,
    trainingLoading,
    ivlLoading,
    volleymaniaLoading,
    usersLoading,
    versionLoading,
    seasonsVolleymaniaLoading,
    seasonsIvlLoading,
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
