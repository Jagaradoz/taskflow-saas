import { Navigate, Outlet } from "react-router-dom";
import { getAuthState } from '../mock/auth';

export function GuestRoute(): JSX.Element {
  const auth = getAuthState();
  if (auth?.user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
