import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = { hasAccess?: boolean; children: ReactNode; redirectPath?: string };

const RequireAccessRoutes = ({ hasAccess, children, redirectPath = '/' }: Props) => {
  if (hasAccess) {
    return children;
  }

  return <Navigate to={redirectPath} replace />;
};

export { RequireAccessRoutes };
