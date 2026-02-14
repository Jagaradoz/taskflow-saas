import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { CreateInviteDialog } from '../../invites/components/CreateInviteDialog';
import { MemberTable } from '../components/MemberTable';
import { useAuthQuery } from '@/features/auth/hooks/use-auth';
import { useMembersQuery, useRemoveMemberMutation } from '../hooks/use-members';
import { useCreateInviteMutation, useOrgInvitesQuery } from '@/features/invites/hooks/use-invites';

const MembersPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const { data: auth } = useAuthQuery();
  const { data: members = [] } = useMembersQuery(currentOrgId);
  const { data: invites = [] } = useOrgInvitesQuery(currentOrgId);
  const removeMemberMutation = useRemoveMemberMutation(currentOrgId);
  const createInviteMutation = useCreateInviteMutation(currentOrgId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const currentMembership = auth?.user.memberships.find((m) => m.orgId === currentOrgId);
  const isOwner = currentMembership?.role === 'owner';

  const handleRemove = useCallback(
    async (membershipId: string) => {
      await removeMemberMutation.mutateAsync(membershipId);
    },
    [removeMemberMutation],
  );

  const handleInvite = useCallback(
    async (email: string) => {
      setInviteError(null);

      const normalizedEmail = email.toLowerCase();

      const alreadyMember = members.some(
        (membership) =>
          membership.user?.email?.toLowerCase() === normalizedEmail,
      );
      if (alreadyMember) {
        setInviteError('User is already a member of this organization.');
        return;
      }

      const alreadyInvited = invites.some(
        (invite) =>
          invite.user?.email?.toLowerCase() === normalizedEmail &&
          invite.status === 'pending',
      );
      if (alreadyInvited) {
        setInviteError('User already has a pending invite.');
        return;
      }

      try {
        await createInviteMutation.mutateAsync(email);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send invite';
        setInviteError(message);
        return;
      }

      setDialogOpen(false);
      setInviteError(null);
    },
    [members, invites, createInviteMutation],
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:px-10 lg:py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-bold leading-none tracking-tight text-white sm:text-[36px] lg:text-[42px]">
            MEMBERS
          </h1>
          <p className="font-mono text-sm font-normal text-gray-500">
            Manage your team members and roles
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => {
              setInviteError(null);
              setDialogOpen(true);
            }}
            className="flex h-10 w-full items-center justify-center gap-2 bg-green-primary px-4 py-2.5 font-mono text-[11px] font-bold text-black-on-accent hover:brightness-90 sm:w-auto"
          >
            <Plus size={14} />
            INVITE MEMBER
          </button>
        )}
      </div>

      {/* Table */}
      <MemberTable
        members={members}
        isCurrentUserOwner={isOwner}
        onRemove={handleRemove}
      />

      {isOwner && (
        <CreateInviteDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onInvite={handleInvite}
          error={inviteError}
        />
      )}
    </div>
  );
};

export default MembersPage;
