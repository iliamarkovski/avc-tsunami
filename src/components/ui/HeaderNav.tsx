import { Link } from 'react-router-dom';
import { Button } from '@/components';

const HeaderNav = () => {
  return (
    <nav className="flex items-center gap-2">
      <Button asChild variant="link">
        <Link to="/team">Отбор</Link>
      </Button>
    </nav>
  );
};

HeaderNav.displayName = 'HeaderNav';

export { HeaderNav };
