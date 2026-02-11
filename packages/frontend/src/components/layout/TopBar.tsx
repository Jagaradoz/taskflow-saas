import { OrgSwitcher } from '../../features/orgs/components/OrgSwitcher';

interface TopBarProps {
  currentOrgId: string;
  onSwitchOrg: (orgId: string) => void;
  onCreateOrg: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentOrgId,
  onSwitchOrg,
  onCreateOrg,
}) => (
  <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-10">
    <OrgSwitcher
      currentOrgId={currentOrgId}
      onSwitch={onSwitchOrg}
      onCreate={onCreateOrg}
    />
  </div>
);
