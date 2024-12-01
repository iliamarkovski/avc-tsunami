import { buttonVariants, HeaderNav, LogoutButton } from '@/components';
import { useAuth } from '@/contexts';
import { cn } from '@/lib';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="wrapper flex items-center justify-between">
        <HeaderNav />

        {!!user ? (
          <LogoutButton />
        ) : (
          <Link to="/login" className={cn(buttonVariants({ variant: 'outline' }))}>
            <LogIn />
            Вход
          </Link>
        )}
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };
