import {
  HomePage,
  Layout,
  ActiveMembersPage,
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
  UsersPage,
  EditUserPage,
  VersionPage,
  EditVersionPage,
  AddVersionPage,
  DashboardSeasonsNavPage,
  ProfilePage,
} from '@/components';
import { QUERY_KEYS } from '@/constants';
import { useData, useTheme } from '@/contexts';
import { RequireAccessRoutes } from '@/routes';
import { Helmet } from 'react-helmet-async';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

const AppRouter = () => {
  const { data } = useData();
  const { loggedInUser } = data;
  const { theme } = useTheme();

  const router = createBrowserRouter([
    {
      element: <Layout key={loggedInUser?.modifiedAt?.toString()} />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/team',
          element: <ActiveMembersPage />,
        },
        {
          path: '/login',
          element: (
            <RequireAccessRoutes hasAccess={!loggedInUser}>
              <Outlet />
            </RequireAccessRoutes>
          ),
          children: [
            {
              index: true,
              element: <LoginPage />,
            },
          ],
        },
        {
          path: '/profile',
          element: (
            <RequireAccessRoutes hasAccess={!!loggedInUser}>
              <Outlet />
            </RequireAccessRoutes>
          ),
          children: [
            {
              index: true,
              element: <ProfilePage />,
            },
          ],
        },
        {
          path: '/dashboard',
          element: (
            <RequireAccessRoutes hasAccess={loggedInUser?.isAdmin}>
              <Outlet />
            </RequireAccessRoutes>
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
                  element: <NamesPage queryKey={QUERY_KEYS.TEAMS} title="Всички отбори" addButtonLabel="Добави нов" />,
                },
                {
                  path: 'add',
                  element: (
                    <AddNamePage
                      title="Добави отбор"
                      description="Моля, проверете дали отборът вече не е добавен"
                      parentUrl="/dashboard/teams"
                      queryKey={QUERY_KEYS.TEAMS}
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
                      queryKey={QUERY_KEYS.TEAMS}
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
                      queryKey={QUERY_KEYS.VOLLEYMANIA}
                      title="Всички срещи от Volley Mania"
                      addButtonLabel="Добави нова"
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
                      queryKey={QUERY_KEYS.VOLLEYMANIA}
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
                      queryKey={QUERY_KEYS.VOLLEYMANIA}
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
                  element: (
                    <MatchesPage queryKey={QUERY_KEYS.IVL} title="Всички срещи от IVL" addButtonLabel="Добави нова" />
                  ),
                },
                {
                  path: 'add',
                  element: (
                    <AddMatchPage
                      title="Добави среща"
                      description="Добави информацията за срещата от IVL"
                      parentUrl="/dashboard/ivl"
                      queryKey={QUERY_KEYS.IVL}
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
                      queryKey={QUERY_KEYS.IVL}
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
                    <TrainingPage
                      queryKey={QUERY_KEYS.TRAINING}
                      title="Всички тренировки"
                      addButtonLabel="Добави нова"
                    />
                  ),
                },
                {
                  path: 'add',
                  element: (
                    <AddTrainingPage
                      title="Добави тренировка"
                      description="Моля, проверете дали тренировката вече не е добавена"
                      parentUrl="/dashboard/training"
                      queryKey={QUERY_KEYS.TRAINING}
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
                      queryKey={QUERY_KEYS.TRAINING}
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
                  element: <NamesPage queryKey={QUERY_KEYS.HALLS} title="Всички зали" addButtonLabel="Добави нова" />,
                },
                {
                  path: 'add',
                  element: (
                    <AddNamePage
                      title="Добави зала"
                      description="Моля, проверете дали залата вече не е добавена"
                      parentUrl="/dashboard/halls"
                      queryKey={QUERY_KEYS.HALLS}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditNamePage
                      title="Редактиране на зала"
                      description="Редактирайте името на залата"
                      parentUrl="/dashboard/halls"
                      queryKey={QUERY_KEYS.HALLS}
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
                  element: (
                    <MembersPage queryKey={QUERY_KEYS.MEMBERS} title="Всички състезатели" addButtonLabel="Добави нов" />
                  ),
                },
                {
                  path: 'add',
                  element: (
                    <AddMemberPage
                      title="Добави състезател"
                      description="Моля, проверете дали състезателят вече не е добавен"
                      parentUrl="/dashboard/members"
                      queryKey={QUERY_KEYS.MEMBERS}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditMemberPage
                      title="Редактиране на състезател"
                      description="Редактирайте информацията на състезателя"
                      parentUrl="/dashboard/members"
                      queryKey={QUERY_KEYS.MEMBERS}
                    />
                  ),
                },
              ],
            },
            {
              path: 'users',
              element: (
                <RequireAccessRoutes hasAccess={loggedInUser?.isSuperAdmin}>
                  <Outlet />
                </RequireAccessRoutes>
              ),
              children: [
                {
                  index: true,
                  element: <UsersPage queryKey={QUERY_KEYS.USERS} title="Всички потребители" />,
                },
                {
                  path: ':id',
                  element: (
                    <EditUserPage
                      title="Редактиране на потребител"
                      description="Редактирайте информацията на потребителя"
                      parentUrl="/dashboard/users"
                      queryKey={QUERY_KEYS.USERS}
                    />
                  ),
                },
              ],
            },
            {
              path: 'seasons',
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <DashboardSeasonsNavPage />,
                },
                {
                  path: 'volleymania',
                  element: <Outlet />,
                  children: [
                    {
                      index: true,
                      element: (
                        <NamesPage
                          queryKey={QUERY_KEYS.SEASONS}
                          title="Всички сезони във Volley Mania"
                          addButtonLabel="Добави нов"
                        />
                      ),
                    },
                    {
                      path: 'add',
                      element: (
                        <AddNamePage
                          title="Добави сезон"
                          description="Моля, проверете дали сезонът вече не е добавен"
                          parentUrl="/dashboard/seasons/volleymania"
                          queryKey={QUERY_KEYS.SEASONS}
                        />
                      ),
                    },
                    {
                      path: ':id',
                      element: (
                        <EditNamePage
                          title="Редактиране на сезон"
                          description="Редактирайте името на сезона"
                          parentUrl="/dashboard/seasons/volleymania"
                          queryKey={QUERY_KEYS.SEASONS}
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
                      element: (
                        <NamesPage
                          queryKey={QUERY_KEYS.SEASONS}
                          title="Всички сезони във IVL"
                          addButtonLabel="Добави нов"
                        />
                      ),
                    },
                    {
                      path: 'add',
                      element: (
                        <AddNamePage
                          title="Добави сезон"
                          description="Моля, проверете дали сезонът вече не е добавен"
                          parentUrl="/dashboard/seasons/ivl"
                          queryKey={QUERY_KEYS.SEASONS}
                        />
                      ),
                    },
                    {
                      path: ':id',
                      element: (
                        <EditNamePage
                          title="Редактиране на сезон"
                          description="Редактирайте името на сезона"
                          parentUrl="/dashboard/seasons/ivl"
                          queryKey={QUERY_KEYS.SEASONS}
                        />
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: 'version',
              element: (
                <RequireAccessRoutes hasAccess={loggedInUser?.isSuperAdmin}>
                  <Outlet />
                </RequireAccessRoutes>
              ),
              children: [
                {
                  index: true,
                  element: <VersionPage queryKey={QUERY_KEYS.VERSION} title="Версия" addButtonLabel="Добави версия" />,
                },
                {
                  path: 'add',
                  element: (
                    <AddVersionPage
                      title="Добави версия"
                      description="Добавете версия със стойност 1"
                      parentUrl="/dashboard/version"
                      queryKey={QUERY_KEYS.VERSION}
                    />
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <EditVersionPage
                      title="Редактиране на версия"
                      description="Увеличете версията с 1 стъпка"
                      parentUrl="/dashboard/version"
                      queryKey={QUERY_KEYS.VERSION}
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
