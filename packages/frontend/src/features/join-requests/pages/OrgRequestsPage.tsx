import { useState, useCallback } from 'react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { getAuthState } from '../../../mock/auth';
import { getMembersByOrg } from '../../../mock/members';
import { getOrgRequests, resolveRequest } from '../../../mock/membership-requests';
import { RequestList } from '../components/RequestList';
import type { MembershipRequestWithUser } from '../../../mock/membership-requests';

const OrgRequestsPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const auth = getAuthState()!;

  const members = getMembersByOrg(currentOrgId);
  const currentMembership = members.find((m) => m.userId === auth.user.id);
  const isOwner = currentMembership?.role === 'owner';

  const [requests, setRequests] = useState<MembershipRequestWithUser[]>(() =>
    getOrgRequests(currentOrgId),
  );

  const refreshRequests = useCallback(() => {
    setRequests(getOrgRequests(currentOrgId));
  }, [currentOrgId]);

  const handleApprove = useCallback(
    (requestId: string) => {
      resolveRequest(requestId, auth.user.id, 'accepted');
      refreshRequests();
    },
    [auth.user.id, refreshRequests],
  );

  const handleReject = useCallback(
    (requestId: string) => {
      resolveRequest(requestId, auth.user.id, 'rejected');
      refreshRequests();
    },
    [auth.user.id, refreshRequests],
  );

  if (!isOwner) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:px-10 lg:py-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-bold leading-none tracking-tight text-white sm:text-[36px] lg:text-[42px]">
            REQUESTS
          </h1>
          <p className="font-mono text-sm font-normal text-gray-500">
            Only organization owners can manage join requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:px-10 lg:py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-bold leading-none tracking-tight text-white sm:text-[36px] lg:text-[42px]">
            REQUESTS
          </h1>
          <p className="font-mono text-sm font-normal text-gray-500">
            Review join requests from users wanting to join your organization
          </p>
        </div>
      </div>

      {/* Table */}
      <RequestList
        requests={requests}
        variant="org"
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default OrgRequestsPage;
