import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useCallback,useState } from 'react';

interface CreateInviteDialogProps {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
  error: string | null;
}

export const CreateInviteDialog: React.FC<CreateInviteDialogProps> = ({
  open,
  onClose,
  onInvite,
  error,
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      onInvite(email.trim());
    },
    [email, onInvite],
  );

  const handleClose = useCallback(() => {
    setEmail('');
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        INVITE MEMBER
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              autoFocus
              className="h-11 w-full border border-border bg-bg-elevated px-3.5 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none"
            />
            {error && (
              <p className="font-mono text-[11px] text-red-error">{error}</p>
            )}
          </div>
          <p className="font-mono text-[11px] leading-relaxed text-gray-500">
            The user must already have a TaskFlow account. They will receive the
            invite in their &quot;My Invites&quot; page.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 items-center border border-border px-5 font-mono text-[11px] font-bold uppercase tracking-wide text-white hover:border-border-light hover:bg-bg-subtle"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex h-10 items-center bg-green-primary px-5 font-mono text-[11px] font-bold uppercase tracking-wide text-black-on-accent hover:brightness-90"
            >
              SEND INVITE
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
