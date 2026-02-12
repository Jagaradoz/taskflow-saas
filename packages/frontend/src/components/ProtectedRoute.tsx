import { Navigate, Outlet } from "react-router-dom";
import { getAuthState } from '../mock/auth';

export function ProtectedRoute(): JSX.Element {
  const auth = getAuthState();
  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
