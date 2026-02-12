import { useCallback } from 'react';
import { X, Check } from 'lucide-react';
import type { MembershipRequestWithUser } from '../../../mock/membership-requests';

interface RequestListProps {
  requests: MembershipRequestWithUser[];
  variant: 'org' | 'my';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const ORG_COLUMNS = [
  { label: 'USER', width: 'flex-1' },
  { label: 'EMAIL', width: 'flex-1' },
  { label: 'REQUESTED AT', width: 'w-[140px]' },
  { label: 'STATUS', width: 'w-[100px]' },
  { label: 'ACTIONS', width: 'w-[120px]' },
] as const;

const MY_COLUMNS = [
  { label: 'ORGANIZATION', width: 'flex-1' },
  { label: 'MESSAGE', width: 'flex-1' },
  { label: 'STATUS', width: 'w-[100px]' },
  { label: 'ACTIONS', width: 'w-[100px]' },
] as const;

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  variant,
  onApprove,
  onReject,
  onCancel,
}) => {
  const columns = variant === 'org' ? ORG_COLUMNS : MY_COLUMNS;

  if (requests.length === 0) {
    return (
      <div className="border border-border bg-bg-card p-10 text-center">
        <p className="font-mono text-sm text-gray-500">
          {variant === 'org'
            ? 'No join requests yet.'
            : 'You have no pending requests.'}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-bg-card">
      {/* Header */}
      <div className="flex items-center border-b border-border px-4 py-3">
        {columns.map((col) => (
          <div key={col.label} className={`shrink-0 ${col.width}`}>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-gray-500">
              {col.label}
            </span>
          </div>
        ))}
      </div>

      {/* Rows */}
      {requests.map((request) => (
        <RequestRow
          key={request.id}
          request={request}
          variant={variant}
          onApprove={onApprove}
          onReject={onReject}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------

interface RequestRowProps {
  request: MembershipRequestWithUser;
  variant: 'org' | 'my';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusColor: Record<string, string> = {
  pending: 'text-orange-primary',
  accepted: 'text-green-primary',
  declined: 'text-gray-500',
  rejected: 'text-red-error',
};

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const RequestRow: React.FC<RequestRowProps> = ({
  request,
  variant,
  onApprove,
  onReject,
  onCancel,
}) => {
  const handleApprove = useCallback(() => onApprove?.(request.id), [request.id, onApprove]);
  const handleReject = useCallback(() => onReject?.(request.id), [request.id, onReject]);
  const handleCancel = useCallback(() => onCancel?.(request.id), [request.id, onCancel]);

  const isPending = request.status === 'pending';

  if (variant === 'org') {
    return (
      <div className="flex items-center border-b border-border px-4 py-4 last:border-b-0">
        {/* User */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border-light bg-bg-subtle">
            <span className="font-mono text-[10px] font-semibold text-gray-500">
              {request.user?.name
                ? request.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : 'UN'}
            </span>
          </div>
          <span className="truncate font-mono text-[13px] font-medium text-white">
            {request.user?.name ?? 'Unknown User'}
          </span>
        </div>

        {/* Email */}
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[13px] font-medium text-gray-500">
            {request.user?.email ?? 'No Email'}
          </span>
        </div>

        {/* Requested At */}
        <div className="w-[140px] shrink-0">
          <span className="font-mono text-[12px] font-medium text-gray-500">
            {formatRelativeTime(request.createdAt)}
          </span>
        </div>

        {/* Status */}
        <div className="w-[100px] shrink-0">
          <span
            className={`font-mono text-[11px] font-bold uppercase ${statusColor[request.status] ?? 'text-gray-500'}`}
          >
            {request.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex w-[120px] shrink-0 gap-2">
          {isPending && (
            <>
              {onReject && (
                <button
                  onClick={handleReject}
                  className="flex h-7 w-7 items-center justify-center border border-border text-gray-400 hover:border-red-error hover:text-red-error"
                  title="Reject"
                >
                  <X size={14} />
                </button>
              )}
              {onApprove && (
                <button
                  onClick={handleApprove}
                  className="flex h-7 w-7 items-center justify-center bg-green-primary text-black-on-accent hover:brightness-90"
                  title="Approve"
                >
                  <Check size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // variant === 'my'
  return (
    <div className="flex items-center border-b border-border px-4 py-4 last:border-b-0">
      {/* Organization */}
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[13px] font-medium text-white">
          {request.org?.name ?? 'Unknown'}
        </span>
      </div>

      {/* Message */}
      <div className="min-w-0 flex-1">
        <span className="truncate font-mono text-[12px] font-medium text-gray-500">
          {request.message || '—'}
        </span>
      </div>

      {/* Status */}
      <div className="w-[100px] shrink-0">
        <span
          className={`font-mono text-[11px] font-bold uppercase ${statusColor[request.status] ?? 'text-gray-500'}`}
        >
          {request.status}
        </span>
      </div>

      {/* Actions */}
      <div className="w-[100px] shrink-0">
        {isPending && onCancel && (
          <button
            onClick={handleCancel}
            className="flex h-8 items-center gap-1.5 border border-border px-3 font-mono text-[10px] font-bold uppercase tracking-wide text-white hover:border-border-light hover:bg-bg-subtle"
          >
            <X size={12} />
            CANCEL
          </button>
        )}
      </div>
    </div>
  );
};
