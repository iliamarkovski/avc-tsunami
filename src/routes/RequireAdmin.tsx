import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = { isAdmin?: boolean; children: ReactNode };

const RequireAdmin = ({ isAdmin, children }: Props) => {
  if (isAdmin) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export { RequireAdmin };
