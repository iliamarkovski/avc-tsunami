import { HeaderNav, LoginMenu, LogoutMenu } from '@/components';
import { useAuth } from '@/contexts';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur p-safe supports-[backdrop-filter]:bg-background/60">
      <div className="wrapper flex items-center justify-between">
        <HeaderNav />

        {!!user ? <LogoutMenu /> : <LoginMenu />}
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };
