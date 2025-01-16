import { HeaderNav, LoginMenu, LogoutMenu } from '@/components';
import { useData } from '@/contexts';

const Header = () => {
  const { data } = useData();
  const { loggedInUser } = data;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur p-safe supports-[backdrop-filter]:bg-background/60">
      <div className="wrapper flex items-center justify-between">
        <HeaderNav />

        {!!loggedInUser ? <LogoutMenu /> : <LoginMenu />}
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export { Header };
