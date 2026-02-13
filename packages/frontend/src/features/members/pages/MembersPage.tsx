import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { getAuthState } from '../../../mock/auth';
import { getMembersByOrg, removeMember } from '../../../mock/members';
import {
  createInvite,
  getOrgInvites,
} from '../../../mock/membership-requests';
import { CreateInviteDialog } from '../../invites/components/CreateInviteDialog';
import { MemberTable } from '../components/MemberTable';
import type { Membership } from '../../../types/membership';

const MembersPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const auth = getAuthState()!;

  const [members, setMembers] = useState<Membership[]>(() =>
    getMembersByOrg(currentOrgId),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const currentMembership = members.find((m) => m.userId === auth.user.id);
  const isOwner = currentMembership?.role === 'owner';

  const handleRemove = useCallback(
    (membershipId: string) => {
      removeMember(membershipId);
      setMembers(getMembersByOrg(currentOrgId));
    },
    [currentOrgId],
  );

  const handleInvite = useCallback(
    (email: string) => {
      setInviteError(null);

      const normalizedEmail = email.toLowerCase();

      const alreadyMember = getMembersByOrg(currentOrgId).some(
        (membership) =>
          membership.user?.email?.toLowerCase() === normalizedEmail,
      );
      if (alreadyMember) {
        setInviteError('User is already a member of this organization.');
        return;
      }

      const alreadyInvited = getOrgInvites(currentOrgId).some(
        (invite) =>
          invite.user?.email?.toLowerCase() === normalizedEmail &&
          invite.status === 'pending',
      );
      if (alreadyInvited) {
        setInviteError('User already has a pending invite.');
        return;
      }

      const result = createInvite(currentOrgId, email, auth.user.id);
      if (!result) {
        setInviteError('User not found. They must have a TaskFlow account.');
        return;
      }

      setDialogOpen(false);
      setInviteError(null);
    },
    [currentOrgId, auth.user.id],
  );

  return (
    <div className="flex flex-col gap-8 p-8 px-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[42px] font-bold leading-none tracking-tight text-white">
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
            className="flex items-center gap-2 bg-green-primary px-4 py-2.5 font-mono text-[11px] font-bold text-black-on-accent hover:brightness-90"
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
