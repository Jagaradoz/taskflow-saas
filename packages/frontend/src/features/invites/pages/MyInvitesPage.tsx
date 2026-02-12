import { useState, useCallback } from 'react';
import { getAuthState } from '../../../mock/auth';
import { getMyInvites, resolveRequest } from '../../../mock/membership-requests';
import { InviteList } from '../components/InviteList';
import type { MembershipRequestWithUser } from '../../../types/membership-request';

const MyInvitesPage: React.FC = () => {
  const auth = getAuthState()!;

  const [invites, setInvites] = useState<MembershipRequestWithUser[]>(() =>
    getMyInvites(auth.user.id),
  );

  const refreshInvites = useCallback(() => {
    setInvites(getMyInvites(auth.user.id));
  }, [auth.user.id]);

  const handleAccept = useCallback(
    (inviteId: string) => {
      resolveRequest(inviteId, auth.user.id, 'accepted');
      refreshInvites();
    },
    [auth.user.id, refreshInvites],
  );

  const handleDecline = useCallback(
    (inviteId: string) => {
      resolveRequest(inviteId, auth.user.id, 'declined');
      refreshInvites();
    },
    [auth.user.id, refreshInvites],
  );

  return (
    <div className="flex flex-col gap-8 p-8 px-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[42px] font-bold leading-none tracking-tight text-white">
          MY INVITES
        </h1>
        <p className="font-mono text-sm font-normal text-gray-500">
          Invitations you have received from organizations
        </p>
      </div>

      {/* List */}
      <InviteList
        invites={invites}
        variant="my"
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </div>
  );
};

export default MyInvitesPage;
