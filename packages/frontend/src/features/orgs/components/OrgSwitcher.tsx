import { useState, useCallback } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { ChevronDown, Plus } from 'lucide-react';
import { getAuthState } from '../../../mock/auth';
import type { AuthState } from '../../../mock/auth';

interface OrgSwitcherProps {
  currentOrgId: string;
  onSwitch: (orgId: string) => void;
  onCreate: () => void;
}

export const OrgSwitcher: React.FC<OrgSwitcherProps> = ({
  currentOrgId,
  onSwitch,
  onCreate,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const auth = getAuthState() as AuthState;

  const currentOrg = auth.memberships.find((m) => m.orgId === currentOrgId);

  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelect = useCallback(
    (orgId: string) => {
      onSwitch(orgId);
      handleClose();
    },
    [onSwitch, handleClose],
  );

  return (
    <>
      <button
        onClick={handleOpen}
        className="ml-auto flex max-w-[78vw] items-center gap-2 border border-border px-3 py-2 font-mono text-xs font-medium text-white hover:border-border-light sm:max-w-[320px]"
      >
        <span className="truncate">{currentOrg?.orgName ?? 'Select organization'}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0A0A0A',
              border: '1px solid #2f2f2f',
              borderRadius: 0,
              minWidth: 220,
              mt: 0.5,
            },
          },
        }}
      >
        {auth.memberships.map((m) => (
          <MenuItem
            key={m.orgId}
            selected={m.orgId === currentOrgId}
            onClick={() => handleSelect(m.orgId)}
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.5px',
              py: 1.5,
              '&.Mui-selected': {
                bgcolor: '#00FF8810',
                color: '#00FF88',
              },
              '&:hover': {
                bgcolor: '#1A1A1A',
              },
            }}
          >
            {m.orgName}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            onCreate();
            handleClose();
          }}
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            py: 1.5,
            borderTop: '1px solid #2f2f2f',
            color: '#00FF88',
            gap: 1,
          }}
        >
          <Plus size={14} />
          CREATE ORGANIZATION
        </MenuItem>
      </Menu>
    </>
  );
};
