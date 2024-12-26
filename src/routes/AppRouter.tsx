import {
  HomePage,
  Layout,
  TeamMembersPage,
  LoginPage,
  DashboardNavPage,
  AddNamePage,
  EditNamePage,
  NamesPage,
  MembersPage,
  AddMemberPage,
  EditMemberPage,
  TrainingPage,
  AddTrainingPage,
  EditTrainingPage,
  MatchesPage,
  AddMatchPage,
  EditMatchPage,
} from '@/components';
import { HALLS_KEY, IVL_KEY, MEMBERS_KEY, TEAMS_KEY, TRAINING_KEY, VOLLEYMANIA_KEY } from '@/constants';
import { useAuth, useTheme } from '@/contexts';
import { RequireAdmin } from '@/routes';
import { Helmet } from 'react-helmet-async';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

const AppRouter = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

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
          element: <TeamMembersPage />,
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
              path: 'volleymania',
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: (
                    <MatchesPage
                      queryKey={VOLLEYMANIA_KEY}
                      title="Всички срещи от Volley Mania"
                      addBttonLabel="Добави нова"
                    />
                  ),
                },
                {
                  path: 'add',
                  element: (
                    <AddMatchPage
                      title="Добави среща"
                      description="Добави информацията за срещата от Volley Mania"
                      parentUrl="/dashboard/volleymania"
                      queryKey={VOLLEYMANIA_KEY}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditMatchPage
                      title="Редактиране на среща"
                      description="Редайктирай информацията за срещата от Volley Mania"
                      parentUrl="/dashboard/volleymania"
                      queryKey={VOLLEYMANIA_KEY}
                    />
                  ),
                },
              ],
            },
            {
              path: 'ivl',
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <MatchesPage queryKey={IVL_KEY} title="Всички срещи от IVL" addBttonLabel="Добави нова" />,
                },
                {
                  path: 'add',
                  element: (
                    <AddMatchPage
                      title="Добави среща"
                      description="Добави информацията за срещата от IVL"
                      parentUrl="/dashboard/ivl"
                      queryKey={IVL_KEY}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditMatchPage
                      title="Редактиране на среща"
                      description="Редайктирай информацията за срещата от IVL"
                      parentUrl="/dashboard/ivl"
                      queryKey={IVL_KEY}
                    />
                  ),
                },
              ],
            },
            {
              path: 'training',
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: (
                    <TrainingPage queryKey={TRAINING_KEY} title="Всички тренировки" addBttonLabel="Добави нова" />
                  ),
                },
                {
                  path: 'add',
                  element: (
                    <AddTrainingPage
                      title="Добави тренировка"
                      description="Моля, проверете дали тренировката вече не е добавена"
                      parentUrl="/dashboard/training"
                      queryKey={TRAINING_KEY}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditTrainingPage
                      title="Редактиране на тренировка"
                      description="Редайктирай данните за тренировката"
                      parentUrl="/dashboard/training"
                      queryKey={TRAINING_KEY}
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

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={theme === 'light' ? '#ffffff' : '#020817'} />
      </Helmet>
      <RouterProvider router={router} />
    </>
  );
};

export { AppRouter };
