import { Navigate, Outlet } from "react-router-dom";
import { getAuthState } from "@/lib/mock-data";

export function GuestRoute(): JSX.Element {
  const { user } = getAuthState();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
