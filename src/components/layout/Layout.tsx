import { Outlet } from 'react-router-dom';
import { Footer, Header, PageLoader } from '@/components';
import { useAuth } from '@/contexts';

const Layout = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <Header />

      <main className="p-safe flex flex-1 flex-col gap-4">
        <div className="wrapper flex flex-1 flex-col gap-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { Layout };
