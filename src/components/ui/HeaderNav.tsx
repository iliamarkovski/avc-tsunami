import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components';

const links = [
  {
    title: 'Мачове',
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
    <nav className="flex items-center gap-2">
      {links.map((link) => {
        const isActive = location.pathname === link.url;

        return (
          <Button
            asChild
            variant="ghost"
            className={isActive ? 'bg-accent text-accent-foreground' : undefined}
            key={link.title}>
            <Link to={link.url}>{link.title}</Link>
          </Button>
        );
      })}
    </nav>
  );
};

HeaderNav.displayName = 'HeaderNav';

export { HeaderNav };
