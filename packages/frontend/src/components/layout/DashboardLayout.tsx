import { useCallback } from 'react';
import { Outlet, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { getAuthState } from '../../mock/auth';

export const DashboardLayout: React.FC = () => {
  const auth = getAuthState();
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();

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

  const handleSwitchOrg = useCallback((nextOrgId: string) => {
    navigate(`/app/${nextOrgId}`);
  }, [navigate]);

  const handleCreateOrg = useCallback(() => {
    navigate('/orgs/new');
  }, [navigate]);

  return (
    <div className="flex h-screen bg-bg-page">
      <Sidebar currentOrgId={activeMembership.orgId} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          currentOrgId={activeMembership.orgId}
          onSwitchOrg={handleSwitchOrg}
          onCreateOrg={handleCreateOrg}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ currentOrgId: activeMembership.orgId }} />
        </main>
      </div>
    </div>
  );
};
