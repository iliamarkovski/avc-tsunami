import { deleteDocument } from '@/api';
import {
  buttonVariants,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Title,
  DeleteButton,
  EditLink,
} from '@/components';
import { useData } from '@/contexts';
import { useToast } from '@/hooks';
import { cn } from '@/lib';
import { QueryKeys } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  addBttonLabel?: string;
};

const UsersPage = ({ queryKey, title, addBttonLabel }: Props) => {
  const { toast } = useToast();
  const { data } = useData();
  const { users } = data;

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await deleteDocument(queryKey, id);
    },
    onError: (error) => {
      console.error('error: ', error);
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    },
  });

  const handleDelete = (id: string) => {
    mutate(id);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Имейл</TableHead>
              <TableHead className="!px-0"></TableHead>
              <TableHead className="!px-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="w-full">{user.email}</TableCell>
                  <TableCell className="sticky right-0 !px-0">
                    <EditLink to={user.id!} />
                  </TableCell>
                  <TableCell className="!px-0">
                    <DeleteButton onClick={() => handleDelete(user.id!)} isLoading={isPending} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : null}
    </section>
  );
};

export { UsersPage };
