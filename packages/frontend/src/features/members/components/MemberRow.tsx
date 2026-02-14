import { X } from 'lucide-react';
import { useCallback } from 'react';

import type { Membership } from '../../../types/membership';

interface MemberRowProps {
  member: Membership;
  isCurrentUserOwner: boolean;
  onRemove: (membershipId: string) => void;
}

export const MemberRow: React.FC<MemberRowProps> = ({
  member,
  isCurrentUserOwner,
  onRemove,
}) => {
  const initials = (member.user?.name ?? 'Un')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isOwner = member.role === 'owner';
  const canRemove = isCurrentUserOwner && !isOwner;

  const handleRemove = useCallback(() => {
    onRemove(member.id);
  }, [member.id, onRemove]);

  return (
    <div className="flex items-center border-b border-border px-4 py-4 last:border-b-0">
      {/* Name + Avatar */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border-light bg-bg-subtle">
          <span className="font-mono text-[10px] font-semibold text-gray-500">
            {initials}
          </span>
        </div>
        <span className="truncate font-mono text-[13px] font-medium text-white">
          {member.user?.name ?? 'Unknown User'}
        </span>
      </div>

      {/* Email */}
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[13px] font-medium text-gray-500">
          {member.user?.email ?? 'No Email'}
        </span>
      </div>

      {/* Role */}
      <div className="w-[120px] shrink-0">
        {isOwner ? (
          <span className="inline-block bg-green-tint-20 px-2 py-1 font-mono text-[9px] font-bold text-green-primary">
            OWNER
          </span>
        ) : (
          <span className="inline-block border border-border bg-bg-elevated px-2 py-1 font-mono text-[9px] font-bold text-gray-500">
            MEMBER
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="w-[80px] shrink-0">
        {canRemove && (
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-error"
            title="Remove member"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
