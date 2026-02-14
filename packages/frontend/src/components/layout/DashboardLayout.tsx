import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

import { useAuthQuery } from '@/features/auth/hooks/use-auth';
import { useSwitchOrganizationMutation } from '@/features/orgs/hooks/use-orgs';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const DashboardLayout: React.FC = () => {
  const { data } = useAuthQuery();
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const switchOrgMutation = useSwitchOrganizationMutation();
  const switchingOrgIdRef = useRef<string | null>(null);

  const auth = data?.user;
  const currentOrgId = data?.currentOrgId;
  const orgReady = currentOrgId === orgId;

  const handleSwitchOrg = useCallback(async (nextOrgId: string) => {
    await switchOrgMutation.mutateAsync(nextOrgId);
    navigate(`/app/${nextOrgId}`);
  }, [navigate, switchOrgMutation]);

  const handleCreateOrg = useCallback(() => {
    navigate('/orgs/new');
  }, [navigate]);

  const handleOpenMobileNav = useCallback(() => {
    setMobileNavOpen(true);
  }, []);

  const handleCloseMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  // Auto-switch org when URL orgId differs from session
  useEffect(() => {
    if (!orgId || !auth) return;

    if (currentOrgId === orgId) {
      switchingOrgIdRef.current = null;
      return;
    }

    if (switchingOrgIdRef.current === orgId || switchOrgMutation.isPending) {
      return;
    }

    // Need to switch org on the backend
    switchingOrgIdRef.current = orgId;
    switchOrgMutation
      .mutateAsync(orgId)
      .catch(() => {
        // If switch fails (e.g. not a member), redirect
        navigate('/no-org', { replace: true });
      })
      .finally(() => {
        switchingOrgIdRef.current = null;
      });
  }, [auth, currentOrgId, navigate, orgId, switchOrgMutation]);

  // Redirect if not authenticated (shouldn't happen — ProtectedRoute catches it)
  if (!auth) return <Navigate to="/login" replace />;

  // If user has no orgs, redirect to no-org page
  if (auth.memberships.length === 0) {
    return <Navigate to="/no-org" replace />;
  }

  const firstOrg = auth.memberships[0];
  if (!firstOrg) return <Navigate to="/no-org" replace />;
  if (!orgId) return <Navigate to={`/app/${firstOrg.orgId}`} replace />;

  const activeMembership = auth.memberships.find((membership) => membership.orgId === orgId);
  if (!activeMembership) {
    return <Navigate to={`/app/${firstOrg.orgId}`} replace />;
  }

  // Wait for org switch to complete before rendering children
  if (!orgReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-page">
        <span className="font-mono text-xs text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-page">
      <div className="hidden h-screen lg:block">
        <Sidebar currentOrgId={activeMembership.orgId} />
      </div>

      {mobileNavOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={handleCloseMobileNav}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:hidden ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <Sidebar
          currentOrgId={activeMembership.orgId}
          mobile
          onClose={handleCloseMobileNav}
          onNavigate={handleCloseMobileNav}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          currentOrgId={activeMembership.orgId}
          onSwitchOrg={handleSwitchOrg}
          onCreateOrg={handleCreateOrg}
          onOpenNav={handleOpenMobileNav}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet context={{ currentOrgId: activeMembership.orgId }} />
        </main>
      </div>
    </div>
  );
};
