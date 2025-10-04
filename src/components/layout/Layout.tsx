import { Outlet, useNavigate } from 'react-router-dom';
import { Footer, Header, PageLoader, ReloadBlock } from '@/components';
import { useAuth, useData } from '@/contexts';
import { LATEST_VERSION } from '@/constants';
import { versionToNumber } from '@/lib';
import { useEffect } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const { isLoading: isAuthLoading } = useAuth();
  const { data, isLoading: isDataLoading } = useData();
  const { version } = data;

  useEffect(() => {
    navigate('/'); // Redirect to root on refresh
  }, [navigate]);

  if (isAuthLoading || isDataLoading) {
    return <PageLoader />;
  }

  if (versionToNumber(version?.version || '1.0.0') > versionToNumber(LATEST_VERSION)) {
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
