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
import { ArrowLeft, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  addBttonLabel?: string;
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

const UsersPage = ({ title, addBttonLabel }: Props) => {
  const { data } = useData();
  const { users, members } = data;

  const usersTypes = useMemo(() => {
    return getUserTypeCounts(users);
  }, [users]);

  const activeMembers = useMemo(() => {
    return members.filter((member) => member.active);
  }, [users]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4">
        <Link to="/dashboard" className={cn(buttonVariants({ variant: 'outline' }))}>
          <ArrowLeft />
          Назад
        </Link>

        <div className="flex w-full items-center justify-between gap-4">
          <Title title={title} />

          {addBttonLabel ? (
            <Link to="add" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'px-0 sm:px-4')}>
              <Plus />
              <span className="hidden sm:block">{addBttonLabel}</span>
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
                <TableHead>Тип</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="!px-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const userType = user.role === 'coach' ? 'Т' : user.isMember ? (user.isActive ? 'К' : 'Н') : 'Д';
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.names}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">{userType}</TableCell>
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
            Общо ({users.length}): Картотекирани: {usersTypes.active || 0} / {activeMembers.length}, Некартотекирани:{' '}
            {usersTypes.notActive || 0}, Треньор: {usersTypes.coach || 0}, Други: {usersTypes.other || 0}
          </p>
        </>
      ) : null}
    </section>
  );
};

export { UsersPage };
