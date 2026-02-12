import type { Membership } from '../../../types/membership';
import { MemberRow } from './MemberRow';

interface MemberTableProps {
  members: Membership[];
  isCurrentUserOwner: boolean;
  onRemove: (membershipId: string) => void;
}

const COLUMNS = [
  { label: 'NAME', width: 'flex-1' },
  { label: 'EMAIL', width: 'flex-1' },
  { label: 'ROLE', width: 'w-[120px]' },
  { label: 'ACTIONS', width: 'w-[80px]' },
] as const;

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  isCurrentUserOwner,
  onRemove,
}) => (
  <div className="border border-border bg-bg-card">
    {/* Header */}
    <div className="flex items-center border-b border-border px-4 py-3">
      {COLUMNS.map((col) => (
        <div key={col.label} className={`shrink-0 ${col.width}`}>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-gray-500">
            {col.label}
          </span>
        </div>
      ))}
    </div>

    {/* Rows */}
    {members.map((member) => (
      <MemberRow
        key={member.id}
        member={member}
        isCurrentUserOwner={isCurrentUserOwner}
        onRemove={onRemove}
      />
    ))}
  </div>
);
