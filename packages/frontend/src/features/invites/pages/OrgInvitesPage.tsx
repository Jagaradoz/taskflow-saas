import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { getAuthState } from '../../../mock/auth';
import { getMembersByOrg } from '../../../mock/members';
import {
  getOrgInvites,
  createInvite,
  resolveRequest,
} from '../../../mock/membership-requests';
import { InviteList } from '../components/InviteList';
import { CreateInviteDialog } from '../components/CreateInviteDialog';
import type { MembershipRequestWithUser } from '../../../types/membership-request';

const OrgInvitesPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const auth = getAuthState()!;

  const members = getMembersByOrg(currentOrgId);
  const currentMembership = members.find((m) => m.userId === auth.user.id);
  const isOwner = currentMembership?.role === 'owner';

  const [invites, setInvites] = useState<MembershipRequestWithUser[]>(() =>
    getOrgInvites(currentOrgId),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const refreshInvites = useCallback(() => {
    setInvites(getOrgInvites(currentOrgId));
  }, [currentOrgId]);

  const handleInvite = useCallback(
    (email: string) => {
      setInviteError(null);

      // Check if user is already a member
      const alreadyMember = members.some(
        (m) => m.user.email.toLowerCase() === email.toLowerCase(),
      );
      if (alreadyMember) {
        setInviteError('User is already a member of this organization.');
        return;
      }

      // Check if there's already a pending invite for this email
      const alreadyInvited = invites.some(
        (i) =>
          i.user.email.toLowerCase() === email.toLowerCase() &&
          i.status === 'pending',
      );
      if (alreadyInvited) {
        setInviteError('User already has a pending invite.');
        return;
      }

      const result = createInvite(currentOrgId, auth.user.id, email);
      if (!result) {
        setInviteError('User not found. They must have a TaskFlow account.');
        return;
      }

      setDialogOpen(false);
      setInviteError(null);
      refreshInvites();
    },
    [currentOrgId, auth.user.id, members, invites, refreshInvites],
  );

  const handleRevoke = useCallback(
    (inviteId: string) => {
      resolveRequest(inviteId, auth.user.id, 'revoked');
      refreshInvites();
    },
    [auth.user.id, refreshInvites],
  );

  if (!isOwner) {
    return (
      <div className="flex flex-col gap-8 p-8 px-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[42px] font-bold leading-none tracking-tight text-white">
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
    <div className="flex flex-col gap-8 p-8 px-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[42px] font-bold leading-none tracking-tight text-white">
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
          className="flex items-center gap-2 bg-green-primary px-4 py-2.5 font-mono text-[11px] font-bold text-black-on-accent hover:brightness-90"
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
