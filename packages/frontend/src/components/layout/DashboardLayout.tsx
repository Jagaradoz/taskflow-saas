import { useState, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { getAuthState } from '../../mock/auth';

export const DashboardLayout: React.FC = () => {
  const auth = getAuthState();

  // Redirect if not authenticated (shouldn't happen — ProtectedRoute catches it)
  if (!auth) return <Navigate to="/login" replace />;

  // If user has no orgs, redirect to no-org page
  if (auth.memberships.length === 0) {
    return <Navigate to="/no-org" replace />;
  }

  const firstOrg = auth.memberships[0];
  if (!firstOrg) return <Navigate to="/no-org" replace />;

  return <DashboardShell defaultOrgId={firstOrg.orgId} />;
};

interface DashboardShellProps {
  defaultOrgId: string;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ defaultOrgId }) => {
  const [currentOrgId, setCurrentOrgId] = useState(defaultOrgId);

  const handleSwitchOrg = useCallback((orgId: string) => {
    setCurrentOrgId(orgId);
  }, []);

  const handleCreateOrg = useCallback(() => {
    // TODO: Open create org dialog (Phase 4+)
  }, []);

  return (
    <div className="flex h-screen bg-bg-page">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          currentOrgId={currentOrgId}
          onSwitchOrg={handleSwitchOrg}
          onCreateOrg={handleCreateOrg}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ currentOrgId }} />
        </main>
      </div>
    </div>
  );
};
