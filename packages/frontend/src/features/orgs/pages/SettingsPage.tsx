import { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { getAuthState } from '../../../mock/auth';
import { getOrganization, updateOrganization, deleteOrganization } from '../../../mock/organizations';
import { getMembersByOrg } from '../../../mock/members';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

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

  const nameChanged = name.trim() !== (org?.name ?? '');
  const slugPreview = useMemo(() => generateSlug(name.trim()), [name]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleSave = useCallback(() => {
    if (!org || !isOwner) return;
    updateOrganization(currentOrgId, { name: name.trim(), description: description.trim() || undefined });
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

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isOwner}
              className="h-11 w-full border border-border bg-bg-elevated px-3.5 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isOwner}
              rows={3}
              className="w-full resize-none border border-border bg-bg-elevated px-3.5 py-3 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              SLUG
            </label>
            <div className="flex h-11 w-full items-center border border-border bg-bg-elevated px-3.5">
              <span className="font-mono text-[13px] font-medium text-gray-500">
                {slugPreview || '\u2014'}
              </span>
            </div>
            <span className="font-mono text-[11px] text-gray-500">
              Auto-generated from name{nameChanged ? ' \u2014 will update when saved' : ''}
            </span>
          </div>
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
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0A0A0A',
              border: '1px solid #2f2f2f',
              borderRadius: 0,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '-0.5px',
            pb: 1,
          }}
        >
          DELETE ORGANIZATION
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 pt-2">
            <p className="font-mono text-xs leading-relaxed text-gray-500">
              This action is <span className="font-bold text-red-error">irreversible</span>.
              All tasks, members, and data will be permanently deleted.
            </p>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Type <span className="text-white">{org.slug}</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={org.slug}
                autoFocus
                className="h-11 w-full border border-border bg-bg-elevated px-3.5 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-red-error focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="flex h-10 items-center border border-border px-5 font-mono text-[11px] font-bold uppercase tracking-wide text-white hover:border-border-light hover:bg-bg-subtle"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== org.slug}
                className="flex h-10 items-center bg-red-error px-5 font-mono text-[11px] font-bold uppercase tracking-wide text-white hover:brightness-90 disabled:opacity-40 disabled:hover:brightness-100"
              >
                DELETE
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
