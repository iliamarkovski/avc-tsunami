import { Outlet } from 'react-router-dom';
import { Footer, Header, PageLoader, ReloadBlock } from '@/components';
import { useAuth, useData } from '@/contexts';
import { LATEST_VERSION } from '@/constants';

const Layout = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const { data, isLoading: isDataLoading } = useData();
  const { version } = data;

  if (isAuthLoading || isDataLoading) {
    return <PageLoader />;
  }

  if (Number(version?.version) > Number(LATEST_VERSION)) {
    return <ReloadBlock />;
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
