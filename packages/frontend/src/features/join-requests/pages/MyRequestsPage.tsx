import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RequestList } from '../components/RequestList';
import { useCancelRequestMutation, useMyRequestsQuery } from '../hooks/use-join-requests';

const MyRequestsPage: React.FC = () => {
  const { data: requests = [] } = useMyRequestsQuery();
  const cancelRequestMutation = useCancelRequestMutation();

  const handleCancel = useCallback(
    async (requestId: string) => {
      await cancelRequestMutation.mutateAsync(requestId);
    },
    [cancelRequestMutation],
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg-page">
      {/* Top bar */}
      <div className="flex h-14 items-center border-b border-border px-4 sm:px-6">
        <Link
          to="/app"
          className="flex items-center gap-2 font-mono text-xs font-medium text-gray-500 hover:text-white"
        >
          <ArrowLeft size={14} />
          BACK TO DASHBOARD
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-bold leading-none tracking-tight text-white sm:text-[36px] lg:text-[42px]">
            MY REQUESTS
          </h1>
          <p className="font-mono text-sm font-normal text-gray-500">
            Track the status of your join requests
          </p>
        </div>

        <RequestList
          requests={requests}
          variant="my"
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default MyRequestsPage;
