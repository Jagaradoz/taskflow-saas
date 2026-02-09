import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { SuspenseLoader } from "@/components/SuspenseLoader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestRoute } from "@/components/GuestRoute";

// Lazy-loaded pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));

/**
 * Temporary dashboard placeholder until Phase 4 adds the real layout.
 */
function DashboardPlaceholder(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page">
      <div className="text-center">
        <h1 className="mb-2 font-heading text-4xl font-bold text-white">
          TaskFlow
        </h1>
        <p className="font-mono text-sm text-gray-500">
          Dashboard coming in Phase 4
        </p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // Guest-only routes (redirect to / if logged in)
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: (
          <SuspenseLoader>
            <LoginPage />
          </SuspenseLoader>
        ),
      },
      {
        path: "/register",
        element: (
          <SuspenseLoader>
            <RegisterPage />
          </SuspenseLoader>
        ),
      },
      {
        path: "/landing",
        element: (
          <SuspenseLoader>
            <LoginPage />
          </SuspenseLoader>
        ),
      },
    ],
  },

  // Protected routes (redirect to /login if not logged in)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardPlaceholder />,
      },
    ],
  },

  // Catch-all: redirect to /
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
