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
  Matches,
  MatchTitle,
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
  addButtonLabel: string;
  parentUrl?: string;
};

const MatchesPage = ({ parentUrl = '/dashboard', queryKey, title, addButtonLabel }: Props) => {
  const { toast } = useToast();

  const { data } = useData();
  const { halls, teams } = data;
  const matches = data[queryKey] as Matches[];

  const reversedMatches = useMemo(() => matches?.slice().reverse() || [], [matches]);

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

      {matches?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Час</TableHead>
              <TableHead>Среща</TableHead>
              <TableHead className="w-full">Зала</TableHead>
              <TableHead>Видео</TableHead>
              <TableHead>Статистика</TableHead>
              <TableHead className="!px-0"></TableHead>
              <TableHead className="!px-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reversedMatches.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{format(getDateByTimestamp(item.dateTime), 'dd.MM.yyyy')}</TableCell>
                  <TableCell>{format(getDateByTimestamp(item.dateTime), 'HH:mm')}</TableCell>
                  <TableCell>
                    <MatchTitle
                      isHost={item.host}
                      opponent={getNameById(teams, item.opponent) || ''}
                      gamesHost={item.gamesHost}
                      gamesGuest={item.gamesGuest}
                    />
                  </TableCell>
                  <TableCell>{halls ? getNameById(halls, item.hall) : '???'}</TableCell>
                  <TableCell className="text-center">{item.recordingLink ? 'Да' : 'Не'}</TableCell>
                  <TableCell className="text-center">{item.statisticsDocUrl ? 'Да' : 'Не'}</TableCell>
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

export { MatchesPage };
