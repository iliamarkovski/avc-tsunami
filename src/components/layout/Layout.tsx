import { Outlet } from 'react-router-dom';
import { Header, PageLoader } from '@/components';
import { useAuth } from '@/contexts';

const Layout = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <Header />

      <main className="wrapper flex flex-1 flex-col gap-4 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export { Layout };
