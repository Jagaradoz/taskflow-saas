import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { SuspenseLoader } from "@/components/SuspenseLoader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestRoute } from "@/components/GuestRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NoOrgState } from "@/features/orgs/components/NoOrgState";

// Lazy-loaded pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const TasksPage = lazy(() => import("@/features/tasks/pages/TasksPage"));
const MembersPage = lazy(() => import("@/features/members/pages/MembersPage"));
const SettingsPage = lazy(() => import("@/features/orgs/pages/SettingsPage"));
const OrgInvitesPage = lazy(() => import("@/features/invites/pages/OrgInvitesPage"));
const MyInvitesPage = lazy(() => import("@/features/invites/pages/MyInvitesPage"));
const OrgRequestsPage = lazy(() => import("@/features/join-requests/pages/OrgRequestsPage"));
const MyRequestsPage = lazy(() => import("@/features/join-requests/pages/MyRequestsPage"));
const JoinOrgPage = lazy(() => import("@/features/join-requests/pages/JoinOrgPage"));

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
        element: <DashboardLayout />,
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
            path: "members",
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
    ],
  },

  // Catch-all: redirect to /
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
