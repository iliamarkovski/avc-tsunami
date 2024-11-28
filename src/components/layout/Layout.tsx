import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export { Layout };
