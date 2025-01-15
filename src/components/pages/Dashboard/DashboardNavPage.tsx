import { Title } from '@/components';
import { buttonVariants } from '@/components/ui/Button';
import { useAuth } from '@/contexts';
import { cn } from '@/lib';
import { Link } from 'react-router-dom';

const LINKS: { title: string; url: string; requiredSuperAdmin?: true }[] = [
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
  {
    title: 'Потребители',
    url: 'users',
    requiredSuperAdmin: true,
  },
];

const DashboardNavPage = () => {
  const { user } = useAuth();
  return (
    <section className="flex flex-col gap-4">
      <Title title="Управление" />
      <nav className="flex flex-col gap-4">
        {LINKS.map((link) => {
          if (link.requiredSuperAdmin && !user?.isSuperAdmin) {
            return null;
          }

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
