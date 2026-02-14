import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { SuspenseLoader } from "@/components/SuspenseLoader";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestRoute } from "@/components/GuestRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NoOrgState } from "@/features/orgs/components/NoOrgState";
import { useAuthQuery } from '@/features/auth/hooks/use-auth';

// Lazy-loaded pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const TasksPage = lazy(() => import("@/features/tasks/pages/TasksPage"));
const MembersPage = lazy(() => import("@/features/members/pages/MembersPage"));
const SettingsPage = lazy(() => import("@/features/orgs/pages/SettingsPage"));
const CreateOrgPage = lazy(() => import("@/features/orgs/pages/CreateOrgPage"));
const OrgInvitesPage = lazy(() => import("@/features/invites/pages/OrgInvitesPage"));
const MyInvitesPage = lazy(() => import("@/features/invites/pages/MyInvitesPage"));
const OrgRequestsPage = lazy(() => import("@/features/join-requests/pages/OrgRequestsPage"));
const MyRequestsPage = lazy(() => import("@/features/join-requests/pages/MyRequestsPage"));
const JoinOrgPage = lazy(() => import("@/features/join-requests/pages/JoinOrgPage"));
const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));

function AppOrgRedirect(): JSX.Element {
  const { data } = useAuthQuery();
  const firstOrg = data?.user.memberships[0];
  if (!firstOrg) {
    return <Navigate to="/no-org" replace />;
  }

  return <Navigate to={`/app/${firstOrg.orgId}`} replace />;
}

export const router = createBrowserRouter([
  // Guest-only routes (redirect to /app/:orgId if logged in)
  {
    element: (
      <SuspenseLoader>
        <GuestRoute />
      </SuspenseLoader>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/",
        element: (
          <SuspenseLoader>
            <LandingPage />
          </SuspenseLoader>
        ),
      },
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
    ],
  },

  // Protected routes (redirect to /login if not logged in)
  {
    element: (
      <SuspenseLoader>
        <ProtectedRoute />
      </SuspenseLoader>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/app",
        element: <AppOrgRedirect />,
      },
      {
        path: "/app/:orgId",
        element: (
          <SuspenseLoader>
            <DashboardLayout />
          </SuspenseLoader>
        ),
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            index: true,
            element: (
              <SuspenseLoader>
                <TasksPage />
              </SuspenseLoader>
            ),
          },
          {
            path: "member",
            element: (
              <SuspenseLoader>
                <MembersPage />
              </SuspenseLoader>
            ),
          },
          {
            path: "settings",
            element: (
              <SuspenseLoader>
                <SettingsPage />
              </SuspenseLoader>
            ),
          },
          {
            path: "invites",
            element: (
              <SuspenseLoader>
                <OrgInvitesPage />
              </SuspenseLoader>
            ),
          },
          {
            path: "me/invites",
            element: (
              <SuspenseLoader>
                <MyInvitesPage />
              </SuspenseLoader>
            ),
          },
          {
            path: "requests",
            element: (
              <SuspenseLoader>
                <OrgRequestsPage />
              </SuspenseLoader>
            ),
          },
        ],
      },
      {
        path: "/me/requests",
        element: (
          <SuspenseLoader>
            <MyRequestsPage />
          </SuspenseLoader>
        ),
      },
      {
        path: "/join/:slug",
        element: (
          <SuspenseLoader>
            <JoinOrgPage />
          </SuspenseLoader>
        ),
      },
      {
        path: "/no-org",
        element: <NoOrgState />,
      },
      {
        path: "/orgs/new",
        element: (
          <SuspenseLoader>
            <CreateOrgPage />
          </SuspenseLoader>
        ),
      },
    ],
  },

  // Catch-all: redirect to landing page
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
