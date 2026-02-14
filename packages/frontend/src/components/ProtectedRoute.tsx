import { Navigate, Outlet } from "react-router-dom";
import { useAuthQuery } from '@/features/auth/hooks/use-auth';

export function ProtectedRoute(): JSX.Element {
  const { data } = useAuthQuery();

  if (!data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
