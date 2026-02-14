import { Check,X } from 'lucide-react';
import { useCallback } from 'react';

import type { MembershipRequestWithUser } from '@/types/membership-request';

interface InviteListProps {
  invites: MembershipRequestWithUser[];
  variant: 'org' | 'my';
  onRevoke?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const ORG_COLUMNS = [
  { label: 'USER', width: 'flex-1' },
  { label: 'EMAIL', width: 'flex-1' },
  { label: 'ROLE', width: 'w-[100px]' },
  { label: 'STATUS', width: 'w-[100px]' },
  { label: 'ACTIONS', width: 'w-[80px]' },
] as const;

const MY_COLUMNS = [
  { label: 'ORGANIZATION', width: 'flex-1' },
  { label: 'INVITED BY', width: 'flex-1' },
  { label: 'STATUS', width: 'w-[100px]' },
  { label: 'ACTIONS', width: 'w-[180px]' },
] as const;

export const InviteList: React.FC<InviteListProps> = ({
  invites,
  variant,
  onRevoke,
  onAccept,
  onDecline,
}) => {
  const columns = variant === 'org' ? ORG_COLUMNS : MY_COLUMNS;
  const minTableWidth =
    variant === 'org' ? 'min-w-[760px] lg:min-w-0' : 'min-w-[680px] lg:min-w-0';

  if (invites.length === 0) {
    return (
      <div className="border border-border bg-bg-card p-10 text-center">
        <p className="font-mono text-sm text-gray-500">
          {variant === 'org' ? 'No invites sent yet.' : 'You have no invites.'}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-bg-card">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <div className={`w-full ${minTableWidth}`}>
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
          {invites.map((invite) => (
            <InviteRow
              key={invite.id}
              invite={invite}
              variant={variant}
              onRevoke={onRevoke}
              onAccept={onAccept}
              onDecline={onDecline}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

interface InviteRowProps {
  invite: MembershipRequestWithUser;
  variant: 'org' | 'my';
  onRevoke?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const InviteRow: React.FC<InviteRowProps> = ({
  invite,
  variant,
  onRevoke,
  onAccept,
  onDecline,
}) => {
  const handleRevoke = useCallback(() => onRevoke?.(invite.id), [invite.id, onRevoke]);
  const handleAccept = useCallback(() => onAccept?.(invite.id), [invite.id, onAccept]);
  const handleDecline = useCallback(() => onDecline?.(invite.id), [invite.id, onDecline]);

  const isPending = invite.status === 'pending';

  const statusColor: Record<string, string> = {
    pending: 'text-orange-primary',
    accepted: 'text-green-primary',
    declined: 'text-gray-500',
    revoked: 'text-red-error',
  };

  if (variant === 'org') {
    return (
      <div className="flex items-center border-b border-border px-4 py-4 last:border-b-0">
        {/* User */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border-light bg-bg-subtle">
            <span className="font-mono text-[10px] font-semibold text-gray-500">
              {invite.user?.name ? invite.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'UN'}
            </span>
          </div>
          <span className="truncate font-mono text-[13px] font-medium text-white">
            {invite.user?.name ?? 'Unknown User'}
          </span>
        </div>

        {/* Email */}
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[13px] font-medium text-gray-500">
            {invite.user?.email ?? 'No Email'}
          </span>
        </div>

        {/* Role */}
        <div className="w-[100px] shrink-0">
          <span className="inline-block border border-border bg-bg-elevated px-2 py-1 font-mono text-[9px] font-bold text-gray-500">
            MEMBER
          </span>
        </div>

        {/* Status */}
        <div className="w-[100px] shrink-0">
          <span
            className={`font-mono text-[11px] font-bold uppercase ${statusColor[invite.status] ?? 'text-gray-500'}`}
          >
            {invite.status}
          </span>
        </div>

        {/* Actions */}
        <div className="w-[80px] shrink-0">
          {isPending && onRevoke && (
            <button
              onClick={handleRevoke}
              className="text-gray-400 hover:text-red-error"
              title="Revoke invite"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // variant === 'my'
  return (
    <div className="flex items-center border-b border-border px-4 py-4 last:border-b-0">
      {/* Org */}
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[13px] font-medium text-white">
          {invite.org?.name ?? 'Unknown'}
        </span>
      </div>

      {/* Invited By */}
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[13px] font-medium text-gray-500">
          {invite.inviter?.name ?? 'Unknown'}
        </span>
      </div>

      {/* Status */}
      <div className="w-[100px] shrink-0">
        <span
          className={`font-mono text-[11px] font-bold uppercase ${statusColor[invite.status] ?? 'text-gray-500'}`}
        >
          {invite.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex w-[180px] shrink-0 justify-end gap-2">
        {isPending && (
          <>
            {onDecline && (
              <button
                onClick={handleDecline}
                className="flex h-8 items-center gap-1.5 border border-border px-3 font-mono text-[10px] font-bold uppercase tracking-wide whitespace-nowrap text-white hover:border-border-light hover:bg-bg-subtle"
              >
                <X size={12} />
                DECLINE
              </button>
            )}
            {onAccept && (
              <button
                onClick={handleAccept}
                className="flex h-8 items-center gap-1.5 bg-green-primary px-3 font-mono text-[10px] font-bold uppercase tracking-wide whitespace-nowrap text-black-on-accent hover:brightness-90"
              >
                <Check size={12} />
                ACCEPT
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
