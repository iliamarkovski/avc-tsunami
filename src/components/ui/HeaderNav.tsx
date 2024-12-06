import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '@/components';
import { cn } from '@/lib';

const links = [
  {
    title: 'Програма',
    url: '/',
  },
  {
    title: 'Отбор',
    url: '/team',
  },
];

const HeaderNav = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const isActive = location.pathname === link.url;

        return (
          <Link
            key={link.url}
            to={link.url}
            className={cn(buttonVariants({ variant: 'ghost' }), {
              'bg-accent text-accent-foreground': isActive,
            })}>
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
};

HeaderNav.displayName = 'HeaderNav';

export { HeaderNav };
