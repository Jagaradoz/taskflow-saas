import { Navigate, Outlet } from "react-router-dom";
import { getAuthState } from "@/lib/mock-data";

export function ProtectedRoute(): JSX.Element {
  const { user } = getAuthState();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
