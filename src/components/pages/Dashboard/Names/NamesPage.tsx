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
  Names,
} from '@/components';
import { DEFAULT_HALL_ID, QUERY_KEYS } from '@/constants';
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
  addBttonLabel: string;
};

const NamesPage = ({ queryKey, title, addBttonLabel }: Props) => {
  const { data } = useData();
  const names = data[queryKey] as Names[];

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
    <section className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4">
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

      {names.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Име</TableHead>
              <TableHead className="!px-0"></TableHead>
              <TableHead className="!px-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {names.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="w-full">{item.name}</TableCell>
                  <TableCell className="!px-0">
                    <EditLink to={item.id!} />
                  </TableCell>
                  <TableCell className="sticky right-0 !px-0">
                    <DeleteButton
                      onClick={() => handleDelete(item.id!)}
                      isLoading={isPending}
                      disabled={queryKey === QUERY_KEYS.HALLS && item.id === DEFAULT_HALL_ID}
                    />
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

export { NamesPage };
