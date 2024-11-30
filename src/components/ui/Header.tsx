import { Button, HeaderNav } from '@/components';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b">
      <div className="wrapper flex items-center justify-between">
        <HeaderNav />

        <Button asChild variant="outline">
          <Link to="/login">
            <LogIn />
            Вход
          </Link>
        </Button>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };
