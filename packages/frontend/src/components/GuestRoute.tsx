import { Navigate, Outlet } from "react-router-dom";
import { useAuthQuery } from '@/features/auth/hooks/use-auth';

export function GuestRoute(): JSX.Element {
  const { data } = useAuthQuery();

  if (data?.user) {
    const firstOrg = data.user.memberships[0];
    return <Navigate to={firstOrg ? `/app/${firstOrg.orgId}` : "/no-org"} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
