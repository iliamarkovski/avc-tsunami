import { HomePage, Layout } from '@/components';
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
          path: '*',
          element: <p>404 Error - Nothing here...</p>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export { AppRouter };
