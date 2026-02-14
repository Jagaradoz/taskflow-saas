import { useCallback } from 'react';
import { InviteList } from '../components/InviteList';
import { useAcceptInviteMutation, useDeclineInviteMutation, useMyInvitesQuery } from '../hooks/use-invites';

const MyInvitesPage: React.FC = () => {
  const { data: invites = [] } = useMyInvitesQuery();
  const acceptInviteMutation = useAcceptInviteMutation();
  const declineInviteMutation = useDeclineInviteMutation();

  const handleAccept = useCallback(
    async (inviteId: string) => {
      await acceptInviteMutation.mutateAsync(inviteId);
    },
    [acceptInviteMutation],
  );

  const handleDecline = useCallback(
    async (inviteId: string) => {
      await declineInviteMutation.mutateAsync(inviteId);
    },
    [declineInviteMutation],
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:px-10 lg:py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-bold leading-none tracking-tight text-white sm:text-[36px] lg:text-[42px]">
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
