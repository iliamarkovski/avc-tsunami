import {
  HomePage,
  Layout,
  TeamPage,
  LoginPage,
  DashboardNavPage,
  AddNamePage,
  EditNamePage,
  NamesPage,
  MembersPage,
  AddMemberPage,
  EditMemberPage,
} from '@/components';
import { HALLS_KEY, MEMBERS_KEY, TEAMS_KEY } from '@/constants';
import { useAuth } from '@/contexts';
import { RequireAdmin } from '@/routes';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

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
          element: !user ? <LoginPage /> : <Navigate to="/" replace />,
        },
        {
          path: '/dashboard',
          element: (
            <RequireAdmin isAdmin={user?.isAdmin}>
              <Outlet />
            </RequireAdmin>
          ),
          children: [
            {
              index: true,
              element: <DashboardNavPage />,
            },
            {
              path: 'teams',
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <NamesPage queryKey={TEAMS_KEY} title="Всички отбори" addBttonLabel="Добави нов" />,
                },
                {
                  path: 'add',
                  element: (
                    <AddNamePage
                      title="Добави отбор"
                      description="Моля, проверете дали отборът вече не е добавен"
                      parentUrl="/dashboard/teams"
                      queryKey={TEAMS_KEY}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditNamePage
                      title="Редактиране на отбор"
                      description="Редайктирай името на отбора"
                      parentUrl="/dashboard/teams"
                      queryKey={TEAMS_KEY}
                    />
                  ),
                },
              ],
            },
            {
              path: 'halls',
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <NamesPage queryKey={HALLS_KEY} title="Всички зали" addBttonLabel="Добави нова" />,
                },
                {
                  path: 'add',
                  element: (
                    <AddNamePage
                      title="Добави зала"
                      description="Моля, проверете дали залата вече не е добавена"
                      parentUrl="/dashboard/halls"
                      queryKey={HALLS_KEY}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditNamePage
                      title="Редактиране на зала"
                      description="Редайктирайте името на залата"
                      parentUrl="/dashboard/halls"
                      queryKey={HALLS_KEY}
                    />
                  ),
                },
              ],
            },
            {
              path: 'members',
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <MembersPage queryKey={MEMBERS_KEY} title="Всички състезатели" addBttonLabel="Добави нов" />,
                },
                {
                  path: 'add',
                  element: (
                    <AddMemberPage
                      title="Добави състезател"
                      description="Моля, проверете дали състезателят вече не е добавен"
                      parentUrl="/dashboard/members"
                      queryKey={MEMBERS_KEY}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditMemberPage
                      title="Редактиране на състезател"
                      description="Редайктирайте информацията на състезателя"
                      parentUrl="/dashboard/members"
                      queryKey={MEMBERS_KEY}
                    />
                  ),
                },
              ],
            },
          ],
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
