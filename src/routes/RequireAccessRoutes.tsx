import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = { hasAccess?: boolean; children: ReactNode };

const RequireAccessRoutes = ({ hasAccess, children }: Props) => {
  if (hasAccess) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export { RequireAccessRoutes };
