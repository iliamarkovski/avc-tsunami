import { Logo, Button, HeaderNav } from '@/components';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b">
      <div className="wrapper flex items-center justify-between">
        <Link to="/">
          <Logo className="w-12 text-primary" />
        </Link>

        <div className="flex items-center gap-4">
          <HeaderNav />

          <Button asChild size="lg">
            <Link to="/login">Вход</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };
