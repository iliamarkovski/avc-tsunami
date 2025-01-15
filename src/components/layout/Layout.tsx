import { Outlet } from 'react-router-dom';
import { Button, Footer, Header, PageLoader, Title } from '@/components';
import { useAuth, useData } from '@/contexts';
import { RotateCw } from 'lucide-react';
import packageJosn from '../../../package.json';

const Layout = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const { data, isLoading: isDataLoading } = useData();
  const { version } = data;

  const localVersion = packageJosn.version;

  const handleRefresh = () => {
    // Clear cache and refresh the page
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }

    window.location.reload();
  };

  if (isAuthLoading || isDataLoading) {
    return <PageLoader />;
  }

  if (Number(localVersion) !== Number(version?.version)) {
    return (
      <div className="flex min-h-svh w-full flex-col">
        <main className="wrapper flex flex-1 flex-col items-center justify-center gap-4 p-safe">
          <Title title="Нова версия е налична " />
          <Button type="button" variant="outline" onClick={handleRefresh}>
            <RotateCw />
            Презареди
          </Button>
        </main>
      </div>
    );
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
