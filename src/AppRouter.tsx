import { HomePage, Layout, TeamPage, LoginPage } from '@/components';
import { useAuth } from '@/contexts';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const AppRouter = () => {
  const { user } = useAuth();

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/team',
          element: <TeamPage />,
        },
        {
          path: '/login',
          element: !!user ? <Navigate to="/" replace /> : <LoginPage />,
        },
        {
          path: '*',
          element: <p>Грешка 404 - Страницата не е намерена</p>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export { AppRouter };
