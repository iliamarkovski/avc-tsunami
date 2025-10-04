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
  Training,
} from '@/components';
import { QUERY_KEYS } from '@/constants';
import { useData } from '@/contexts';
import { useLiveData, useToast } from '@/hooks';
import { cn, getDateByTimestamp, getNameById } from '@/lib';
import { QueryKeys } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  addButtonLabel: string;
  parentUrl?: string;
};

const TrainingPage = ({ parentUrl = '/dashboard', queryKey, title, addButtonLabel }: Props) => {
  const { toast } = useToast();
  const { data: training, loading: trainingLoading } = useLiveData<Training[]>(QUERY_KEYS.TRAINING);
  const { data } = useData();
  const { halls } = data;

  const sortedTraining = training?.sort((a, b) => {
    const dateA = getDateByTimestamp(a.dateTime).getTime();
    const dateB = getDateByTimestamp(b.dateTime).getTime();

    return dateB - dateA;
  });

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

  if (trainingLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4">
        <Link to={parentUrl} className={cn(buttonVariants({ variant: 'outline' }))}>
          <ArrowLeft />
          Назад
        </Link>

        <div className="flex w-full items-center justify-between gap-4">
          <Title title={title} />

          <Link to="add" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'px-0 sm:px-4')}>
            <Plus />
            <span className="hidden sm:block">{addButtonLabel}</span>
          </Link>
        </div>
      </div>

      {sortedTraining && sortedTraining?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Час</TableHead>
              <TableHead className="w-full">Зала</TableHead>
              <TableHead className="!px-0"></TableHead>
              <TableHead className="!px-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTraining?.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{format(getDateByTimestamp(item.dateTime), 'dd.MM.yyyy')}</TableCell>
                  <TableCell>{format(getDateByTimestamp(item.dateTime), 'HH:mm')}</TableCell>
                  <TableCell>{halls ? getNameById(halls, item.hall) : '-'}</TableCell>
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
