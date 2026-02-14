import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { InviteList } from '../components/InviteList';
import { CreateInviteDialog } from '../components/CreateInviteDialog';
import { useAuthQuery } from '@/features/auth/hooks/use-auth';
import { useCreateInviteMutation, useOrgInvitesQuery, useRevokeInviteMutation } from '../hooks/use-invites';

const OrgInvitesPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const { data: auth } = useAuthQuery();
  const { data: invites = [] } = useOrgInvitesQuery(currentOrgId);
  const createInviteMutation = useCreateInviteMutation(currentOrgId);
  const revokeInviteMutation = useRevokeInviteMutation(currentOrgId);

  const currentMembership = auth?.user.memberships.find((m) => m.orgId === currentOrgId);
  const isOwner = currentMembership?.role === 'owner';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const handleInvite = useCallback(
    async (email: string) => {
      setInviteError(null);

      try {
        await createInviteMutation.mutateAsync(email);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create invite';
        setInviteError(message);
        return;
      }

      setDialogOpen(false);
      setInviteError(null);
    },
    [createInviteMutation],
  );

  const handleRevoke = useCallback(
    async (inviteId: string) => {
      await revokeInviteMutation.mutateAsync(inviteId);
    },
    [revokeInviteMutation],
  );

  if (!isOwner) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:px-10 lg:py-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-bold leading-none tracking-tight text-white sm:text-[36px] lg:text-[42px]">
            INVITES
          </h1>
          <p className="font-mono text-sm font-normal text-gray-500">
            Only organization owners can manage invites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:px-10 lg:py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-bold leading-none tracking-tight text-white sm:text-[36px] lg:text-[42px]">
            INVITES
          </h1>
          <p className="font-mono text-sm font-normal text-gray-500">
            Invite users to join your organization
          </p>
        </div>
        <button
          onClick={() => {
            setInviteError(null);
            setDialogOpen(true);
          }}
          className="flex h-10 w-full items-center justify-center gap-2 bg-green-primary px-4 py-2.5 font-mono text-[11px] font-bold text-black-on-accent hover:brightness-90 sm:w-auto"
        >
          <Plus size={14} />
          CREATE INVITE
        </button>
      </div>

      {/* Table */}
      <InviteList invites={invites} variant="org" onRevoke={handleRevoke} />

      {/* Dialog */}
      <CreateInviteDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onInvite={handleInvite}
        error={inviteError}
      />
    </div>
  );
};

export default OrgInvitesPage;
