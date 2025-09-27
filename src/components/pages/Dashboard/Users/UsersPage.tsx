import {
  buttonVariants,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Title,
  EditLink,
} from '@/components';
import { EnrichedUser, useData } from '@/contexts';
import { cn } from '@/lib';
import { QueryKeys } from '@/types';
import { ArrowLeft, ArrowUpDown, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  addButtonLabel?: string;
  parentUrl?: string;
};

type UserTypes = 'coach' | 'active' | 'notActive' | 'other';

const getUserTypeCounts = (users: EnrichedUser[]) => {
  return users.reduce(
    (counts, user) => {
      const userType: UserTypes =
        user.role === 'coach' ? 'coach' : user.isMember ? (user.isActive ? 'active' : 'notActive') : 'other';
      counts[userType] = (counts[userType] || 0) + 1;
      return counts;
    },
    {} as Record<UserTypes, number>
  );
};

// 🧭 Helper: consistent label + numeric order for sorting
const getUserTypeLabel = (user: EnrichedUser) => {
  if (user.role === 'coach') return { label: 'Треньор', order: 1 };
  if (user.isMember && user.isActive) return { label: 'Картотекиран', order: 2 };
  if (user.isMember && !user.isActive) return { label: 'Некартотекиран', order: 3 };
  return { label: 'Друг', order: 4 };
};

const UsersPage = ({ parentUrl = '/dashboard', title, addButtonLabel }: Props) => {
  const { data } = useData();
  const { users, members } = data;

  const usersTypes = useMemo(() => getUserTypeCounts(users), [users]);
  const activeMembers = useMemo(() => members.filter((m) => m.active), [members]);

  const [sortConfig, setSortConfig] = useState<{
    column: 'type';
    direction: 'asc' | 'desc';
  }>({ column: 'type', direction: 'asc' });

  const sortedUsers = useMemo(() => {
    const sorted = [...users];
    sorted.sort((a, b) => {
      const typeA = getUserTypeLabel(a).order;
      const typeB = getUserTypeLabel(b).order;
      return sortConfig.direction === 'asc' ? typeA - typeB : typeB - typeA;
    });
    return sorted;
  }, [users, sortConfig]);

  const handleSortByType = () => {
    setSortConfig((prev) => ({
      column: 'type',
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4">
        <Link to={parentUrl} className={cn(buttonVariants({ variant: 'outline' }))}>
          <ArrowLeft />
          Назад
        </Link>

        <div className="flex w-full items-center justify-between gap-4">
          <Title title={title} />
          {addButtonLabel ? (
            <Link to="add" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'px-0 sm:px-4')}>
              <Plus />
              <span className="hidden sm:block">{addButtonLabel}</span>
            </Link>
          ) : null}
        </div>
      </div>

      {users?.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имена</TableHead>
                <TableHead className="w-full">Имейл</TableHead>

                <TableHead onClick={handleSortByType} className="flex cursor-pointer select-none items-center gap-1">
                  Тип
                  <ArrowUpDown
                    className={cn('h-4 w-4 transition-transform', sortConfig.direction === 'asc' ? 'rotate-180' : '')}
                  />
                </TableHead>

                <TableHead>ID</TableHead>
                <TableHead className="!px-0"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedUsers.map((user) => {
                const { label: userType } = getUserTypeLabel(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.names}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{userType}</TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="sticky right-0 !px-0">
                      <EditLink to={user.id!} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <p className="text-center text-sm text-muted-foreground">
            Общо ({users.length}): Картотекирани: {usersTypes.active || 0} (регистрирани) / {activeMembers.length}{' '}
            (общо), Некартотекирани: {usersTypes.notActive || 0}, Треньор: {usersTypes.coach || 0}, Други:{' '}
            {usersTypes.other || 0}
          </p>
        </>
      ) : null}
    </section>
  );
};

export { UsersPage };
