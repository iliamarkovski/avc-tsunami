import { Title } from '@/components';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  parentUrl?: string;
};

const LINKS: { title: string; url: string }[] = [
  {
    title: 'Volley Mania',
    url: 'volleymania',
  },
  {
    title: 'IVL',
    url: 'ivl',
  },
];

const DashboardSeasonsNavPage = ({ parentUrl = '/dashboard' }: Props) => {
  return (
    <section className="flex flex-col items-start gap-4">
      <Link to={parentUrl} className={cn(buttonVariants({ variant: 'outline' }))}>
        <ArrowLeft />
        Назад
      </Link>
      <Title title="Сезони" />
      <nav className="flex w-full flex-col gap-4">
        {LINKS.map((link) => {
          return (
            <Link key={link.url} to={link.url} className={cn(buttonVariants({ variant: 'outline' }))}>
              {link.title}
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export { DashboardSeasonsNavPage };
