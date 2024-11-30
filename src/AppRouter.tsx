import { HomePage, Layout, TeamPage, LoginPage } from '@/components';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const AppRouter = () => {
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
          element: <LoginPage />,
        },
        {
          path: '*',
          element: <p>404 Error - Nothing here...</p>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export { AppRouter };
