import { Outlet } from 'react-router-dom';
import { Header } from '@/components';

const Layout = () => {
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
