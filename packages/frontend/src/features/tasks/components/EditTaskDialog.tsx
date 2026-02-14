import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useCallback,useState } from 'react';

import type { Task } from '../../../types/task';

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (updates: { title: string; description?: string }) => void;
  task: Task | null;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  open,
  onClose,
  onSave,
  task,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prevTaskId, setPrevTaskId] = useState<string | null>(null);

  if (task && task.id !== prevTaskId) {
    setPrevTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description ?? '');
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    },
    [title, description, onSave, onClose],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        EDIT TASK
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              TASK TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
              className="h-11 w-full border border-border bg-bg-elevated px-3.5 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              rows={3}
              className="w-full resize-none border border-border bg-bg-elevated px-3.5 py-2.5 font-mono text-[13px] font-medium text-white placeholder:text-gray-400 focus:border-green-primary focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center border border-border px-5 font-mono text-[11px] font-bold uppercase tracking-wide text-white hover:border-border-light hover:bg-bg-subtle"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex h-10 items-center bg-green-primary px-5 font-mono text-[11px] font-bold uppercase tracking-wide text-black-on-accent hover:brightness-90"
            >
              SAVE CHANGES
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
