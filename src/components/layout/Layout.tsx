import { Outlet } from 'react-router-dom';
import { Footer, Header, PageLoader } from '@/components';
import { useAuth } from '@/contexts';

const Layout = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="pt-safe flex min-h-svh w-full flex-col">
      <Header />

      <main className="wrapper flex flex-1 flex-col gap-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export { Layout };
