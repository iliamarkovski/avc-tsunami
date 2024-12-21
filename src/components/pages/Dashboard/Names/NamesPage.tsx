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
} from '@/components';
import { DEFAULT_HALL_ID, HALLS_KEY } from '@/constants';
import { useToast } from '@/hooks';
import { cn } from '@/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: string;
  title: string;
  addBttonLabel: string;
};

const NamesPage = ({ queryKey, title, addBttonLabel }: Props) => {
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllDocuments<Names>(queryKey),
    staleTime: 60 * 60 * 1000,
  });

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await deleteDocument(queryKey, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: () => {
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

        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <Title title={title} />

          <Link to="add" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'px-0 sm:px-4')}>
            <Plus />
            <span className="hidden sm:block">{addBttonLabel}</span>
          </Link>
        </div>
      </div>

      {sortedData && sortedData?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Име</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="w-full">{item.name}</TableCell>
                  <TableCell className="px-0">
                    <EditLink to={item.id} />
                  </TableCell>
                  <TableCell className="sticky right-0 px-0">
                    <DeleteButton
                      onClick={() => handleDelete(item.id)}
                      isLoading={isPending}
                      disabled={queryKey === HALLS_KEY && item.id === DEFAULT_HALL_ID}
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
