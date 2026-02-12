import { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { getAuthState } from '../../../mock/auth';
import { getOrganization, updateOrganization, deleteOrganization } from '../../../mock/organizations';
import { getMembersByOrg } from '../../../mock/members';

const SettingsPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const auth = getAuthState()!;

  const org = getOrganization(currentOrgId);
  const members = getMembersByOrg(currentOrgId);
  const currentMembership = members.find((m) => m.userId === auth.user.id);
  const isOwner = currentMembership?.role === 'owner';

  const [name, setName] = useState(org?.name ?? '');
  const [description, setDescription] = useState(org?.description ?? '');
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleSave = useCallback(() => {
    if (!org || !isOwner) return;
    updateOrganization(currentOrgId, { name: name.trim(), description: description.trim() || null });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [currentOrgId, name, description, org, isOwner]);

  const handleDelete = useCallback(() => {
    if (!org || confirmText !== org.slug) return;
    deleteOrganization(currentOrgId);
    setDeleteOpen(false);
    // Force full reload so DashboardLayout re-evaluates auth/memberships
    window.location.href = '/';
  }, [currentOrgId, confirmText, org]);

  if (!org) {
    return (
      <div className="p-10">
        <p className="font-mono text-sm text-gray-500">Organization not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 px-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[42px] font-bold leading-none tracking-tight text-white">
          SETTINGS
        </h1>
        <p className="font-mono text-sm font-normal text-gray-500">
          Manage your organization settings
        </p>
      </div>

      {/* General Section */}
      <div className="flex flex-col gap-6 border border-border bg-bg-card p-6">
        <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest text-gray-500">
          General
        </h2>

        <div className="flex flex-col gap-4">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isOwner}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isOwner}
            multiline
            minRows={3}
            fullWidth
          />
          <TextField
            label="Slug"
            value={org.slug}
            disabled
            fullWidth
            helperText="The slug cannot be changed"
          />
        </div>

        {isOwner && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="bg-green-primary px-5 py-2.5 font-mono text-[11px] font-bold text-black-on-accent hover:brightness-90 disabled:opacity-40 disabled:hover:brightness-100"
            >
              SAVE CHANGES
            </button>
            {saved && (
              <span className="font-mono text-xs text-green-primary">
                Changes saved
              </span>
            )}
          </div>
        )}
      </div>

      {/* Danger Zone — owners only */}
      {isOwner && (
        <div className="flex flex-col gap-4 border border-red-error/30 bg-bg-card p-6">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest text-red-error">
            Danger Zone
          </h2>
          <p className="font-mono text-xs leading-relaxed text-gray-500">
            Deleting this organization is permanent and cannot be undone. All tasks,
            memberships, and invites associated with this organization will be removed.
          </p>
          <div>
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-2 border border-red-error/30 bg-red-error/10 px-4 py-2.5 font-mono text-[11px] font-bold text-red-error hover:bg-red-error/20"
            >
              <AlertTriangle size={14} />
              DELETE ORGANIZATION
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle
          sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.5px' }}
        >
          Delete Organization
        </DialogTitle>
        <DialogContent>
          <p className="mb-4 font-mono text-xs leading-relaxed text-gray-500">
            This action is <span className="font-bold text-red-error">irreversible</span>.
            All tasks, members, and data will be permanently deleted.
          </p>
          <p className="mb-4 font-mono text-xs text-gray-500">
            Type <span className="font-bold text-white">{org.slug}</span> to confirm.
          </p>
          <TextField
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={org.slug}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            disabled={confirmText !== org.slug}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
