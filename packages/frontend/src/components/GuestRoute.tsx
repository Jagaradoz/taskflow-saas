import { Navigate, Outlet } from "react-router-dom";
import { getAuthState } from '../mock/auth';

export function GuestRoute(): JSX.Element {
  const auth = getAuthState();
  if (auth?.user) {
    const firstOrg = auth.memberships[0];
    return <Navigate to={firstOrg ? `/app/${firstOrg.orgId}` : "/no-org"} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
