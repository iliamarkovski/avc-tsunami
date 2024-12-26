import { Title } from '@/components';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib';
import { Link } from 'react-router-dom';

const LINKS = [
  {
    title: 'Volley Mania',
    url: 'volleymania',
  },
  {
    title: 'IVL',
    url: 'ivl',
  },
  {
    title: 'Тренировки',
    url: 'training',
  },
  {
    title: 'Зали',
    url: 'halls',
  },
  {
    title: 'Отбори',
    url: 'teams',
  },
  {
    title: 'Състезатели',
    url: 'members',
  },
];

const DashboardNavPage = () => {
  return (
    <section className="flex flex-col gap-4">
      <Title title="Управление" />
      <nav className="flex flex-col gap-4">
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

export { DashboardNavPage };
