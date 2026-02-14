import { Menu } from 'lucide-react';
import { OrgSwitcher } from '../../features/orgs/components/OrgSwitcher';

interface TopBarProps {
  currentOrgId: string;
  onSwitchOrg: (orgId: string) => void;
  onCreateOrg: () => void;
  onOpenNav: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentOrgId,
  onSwitchOrg,
  onCreateOrg,
  onOpenNav,
}) => (
  <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6 lg:px-10">
    <button
      onClick={onOpenNav}
      className="flex h-9 w-9 items-center justify-center border border-border text-gray-500 hover:border-border-light hover:text-white lg:hidden"
      title="Open navigation"
    >
      <Menu size={16} />
    </button>
    <OrgSwitcher
      currentOrgId={currentOrgId}
      onSwitch={onSwitchOrg}
      onCreate={onCreateOrg}
    />
  </div>
);
