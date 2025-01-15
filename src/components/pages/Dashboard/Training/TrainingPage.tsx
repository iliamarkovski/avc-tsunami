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
import { cn, getDateByTimestamp, getNameById } from '@/lib';
import { QueryKeys } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  addBttonLabel: string;
};

const TrainingPage = ({ queryKey, title, addBttonLabel }: Props) => {
  const { toast } = useToast();
  const { data } = useData();
  const { halls, training } = data;

  const reversedTraining = useMemo(() => training?.slice().reverse() || [], [training]);

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

      {training?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата и час</TableHead>
              <TableHead>Зала</TableHead>
              <TableHead className="!px-0"></TableHead>
              <TableHead className="!px-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reversedTraining.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{format(getDateByTimestamp(item.dateTime), 'dd.MM.yyyy HH:mm')}</TableCell>
                  <TableCell className="w-full">{halls ? getNameById(halls, item.hall) : '-'}</TableCell>
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

export { TrainingPage };
