import { Outlet } from 'react-router-dom';
import { Footer, Header, PageLoader } from '@/components';
import { useAuth, useData } from '@/contexts';

const Layout = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const { isLoading: isDataLoading } = useData();

  if (isAuthLoading || isDataLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <Header />

      <main className="flex flex-1 flex-col gap-4 p-safe">
        <div className="wrapper flex flex-1 flex-col gap-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { Layout };
