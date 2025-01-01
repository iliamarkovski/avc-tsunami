import { deleteDocument, fetchAllDocuments } from '@/api';
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
  Matches,
  MatchTitle,
} from '@/components';
import { HALLS_KEY, TEAMS_KEY } from '@/constants';
import { useToast } from '@/hooks';
import { cn, getDateByTimestamp, getNameById } from '@/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: string;
  title: string;
  addBttonLabel: string;
};

const MatchesPage = ({ queryKey, title, addBttonLabel }: Props) => {
  const { data: matches } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllDocuments<Matches>(queryKey),
  });

  const sortedMatches = useMemo(() => {
    if (!matches) return [];
    return [...matches].sort(
      (a, b) => getDateByTimestamp(b.dateTime).getTime() - getDateByTimestamp(a.dateTime).getTime()
    );
  }, [matches]);

  const { data: halls } = useQuery({
    queryKey: [HALLS_KEY],
    queryFn: () => fetchAllDocuments<Names>(HALLS_KEY),
  });

  const { data: opponents } = useQuery({
    queryKey: [TEAMS_KEY],
    queryFn: () => fetchAllDocuments<Names>(TEAMS_KEY),
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await deleteDocument(queryKey, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
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

      {sortedMatches && sortedMatches?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата и час</TableHead>
              <TableHead>Зала</TableHead>
              <TableHead className="w-full">Среща</TableHead>
              <TableHead>Видео</TableHead>
              <TableHead className="!px-0"></TableHead>
              <TableHead className="!px-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMatches.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{format(getDateByTimestamp(item.dateTime), 'dd.MM.yyyy HH:mm')}</TableCell>
                  <TableCell>{halls ? getNameById(halls, item.hall) : '???'}</TableCell>
                  <TableCell className="w-full">
                    <MatchTitle
                      isHost={item.host}
                      opponent={getNameById(opponents, item.opponent) || ''}
                      gamesHost={item.gamesHost}
                      gamesGuest={item.gamesGuest}
                    />
                  </TableCell>
                  <TableCell className="text-center">{item.youtubeLink ? 'Да' : 'Не'}</TableCell>
                  <TableCell className="sticky right-0 !px-0">
                    <EditLink to={item.id} />
                  </TableCell>
                  <TableCell className="!px-0">
                    <DeleteButton onClick={() => handleDelete(item.id)} isLoading={isPending} />
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
