import { HeaderNav, LoginMenu, LogoutMenu } from '@/components';
import { useAuth } from '@/contexts';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="wrapper flex items-center justify-between">
        <HeaderNav />

        {!!user ? <LogoutMenu /> : <LoginMenu />}
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };
