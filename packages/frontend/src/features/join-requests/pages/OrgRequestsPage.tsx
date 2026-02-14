import { useCallback } from 'react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { RequestList } from '../components/RequestList';
import { useAuthQuery } from '@/features/auth/hooks/use-auth';
import { useApproveRequestMutation, useOrgRequestsQuery, useRejectRequestMutation } from '../hooks/use-join-requests';

const OrgRequestsPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const { data: auth } = useAuthQuery();
  const { data: requests = [] } = useOrgRequestsQuery(currentOrgId);
  const approveMutation = useApproveRequestMutation(currentOrgId);
  const rejectMutation = useRejectRequestMutation(currentOrgId);
  const currentMembership = auth?.user.memberships.find((m) => m.orgId === currentOrgId);
  const isOwner = currentMembership?.role === 'owner';

  const handleApprove = useCallback(
    async (requestId: string) => {
      await approveMutation.mutateAsync(requestId);
    },
    [approveMutation],
  );

  const handleReject = useCallback(
    async (requestId: string) => {
      await rejectMutation.mutateAsync(requestId);
    },
    [rejectMutation],
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
