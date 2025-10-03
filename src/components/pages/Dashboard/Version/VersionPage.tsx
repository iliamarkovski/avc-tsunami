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
  VersionFormProps,
} from '@/components';
import { LATEST_VERSION } from '@/constants';
import { useData } from '@/contexts';
import { cn } from '@/lib';
import { QueryKeys } from '@/types';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  addButtonLabel: string;
  parentUrl?: string;
};

const VersionPage = ({ parentUrl = '/dashboard', queryKey, title, addButtonLabel }: Props) => {
  const { data } = useData();
  const version = data[queryKey] as VersionFormProps;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4">
        <Link to={parentUrl} className={cn(buttonVariants({ variant: 'outline' }))}>
          <ArrowLeft />
          Назад
        </Link>

        <div className="flex w-full items-center justify-between gap-4">
          <Title title={title} />

          {!version ? (
            <Link to="add" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'px-0 sm:px-4')}>
              <Plus />
              <span className="hidden sm:block">{addButtonLabel}</span>
            </Link>
          ) : null}
        </div>
      </div>

      {version ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Текуща версия</TableHead>
              <TableHead className="w-full">Последна версия</TableHead>
              <TableHead className="!px-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key={version.id}>
              <TableCell>{version.version}</TableCell>
              <TableCell>{LATEST_VERSION}</TableCell>
              <TableCell className="!px-0">
                <EditLink to={version.id!} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : null}
    </section>
  );
};

export { VersionPage };
