import { Outlet } from 'react-router-dom';
import { Footer, PageLoader } from '@/components';
import { useAuth } from '@/contexts';

const LoginLayout = () => {
  const { isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-safe">
        <div className="wrapper flex flex-1 flex-col items-center justify-center gap-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { LoginLayout };
