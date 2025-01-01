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
import { cn, getRoleLabel } from '@/lib';
import { Roles } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: string;
  title: string;
  addBttonLabel: string;
};

const MembersPage = ({ queryKey, title, addBttonLabel }: Props) => {
  const { data } = useData();
  const { members } = data;

  const sortedMembers = useMemo(() => {
    if (!members) return [];
    return [...members].sort((a, b) => Number(a.number) - Number(b.number));
  }, [members]);

  const { toast } = useToast();

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

          <Link to="add" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'px-0 sm:px-4')}>
            <Plus />
            <span className="hidden sm:block">{addBttonLabel}</span>
          </Link>
        </div>
      </div>

      {sortedMembers && sortedMembers?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Номер</TableHead>
              <TableHead>Имена</TableHead>
              <TableHead>Позиция</TableHead>
              <TableHead>Картотекиран</TableHead>
              <TableHead className="!px-0"></TableHead>
              <TableHead className="!px-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="w-min text-center">{item.number}</TableCell>
                  <TableCell className="w-full">
                    {item.names} {item.captain ? '(к)' : null}
                  </TableCell>
                  <TableCell className="w-max">{getRoleLabel(item.role as Roles)}</TableCell>
                  <TableCell className="w-min text-center">{item.active ? 'Да' : 'Не'}</TableCell>
                  <TableCell className="sticky right-0 !px-0">
                    <EditLink to={item.id!} />
                  </TableCell>
                  <TableCell className="!px-0">
                    <DeleteButton onClick={() => handleDelete(item.id!)} isLoading={isPending} />
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

export { MembersPage };
