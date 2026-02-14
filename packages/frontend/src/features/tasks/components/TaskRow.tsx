import { Circle, CircleCheck, Pencil,Pin, PinOff, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

import type { Task } from '../../../types/task';

interface TaskRowProps {
  task: Task;
  onToggleDone: (taskId: string, isDone: boolean) => void;
  onTogglePin: (taskId: string, isPinned: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggleDone,
  onTogglePin,
  onDelete,
  onEdit,
}) => {
  const handleToggleDone = useCallback(() => {
    onToggleDone(task.id, !task.isDone);
  }, [task.id, task.isDone, onToggleDone]);

  const handleTogglePin = useCallback(() => {
    onTogglePin(task.id, !task.isPinned);
  }, [task.id, task.isPinned, onTogglePin]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [task, onEdit]);

  return (
    <div className="flex items-center border-b border-border px-4 py-4 last:border-b-0">
      {/* Status */}
      <div className="w-[60px] shrink-0">
        <button onClick={handleToggleDone} className="hover:opacity-80">
          {task.isDone ? (
            <CircleCheck size={16} className="text-green-primary" />
          ) : (
            <Circle size={16} className="text-gray-400" />
          )}
        </button>
      </div>

      {/* Title */}
      <div className="min-w-0 flex-1">
        <span
          className={`font-mono text-[13px] font-medium ${
            task.isDone ? 'text-gray-500 line-through' : 'text-white'
          }`}
        >
          {task.title}
        </span>
        {task.description && (
          <p className="line-clamp-1 font-mono text-[11px] text-gray-500">
            {task.description}
          </p>
        )}
      </div>

      {/* Creator */}
      <div className="w-[160px] shrink-0">
        <span className="font-mono text-[13px] font-medium text-gray-500">
          {task.creatorName ?? '—'}
        </span>
      </div>

      {/* Flags */}
      <div className="w-[100px] shrink-0">
        {task.isPinned && (
          <span className="inline-block bg-green-tint-20 px-2 py-1 font-mono text-[9px] font-bold text-green-primary">
            PINNED
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex w-[80px] shrink-0 gap-2">
        <button
          onClick={handleEdit}
          className="text-gray-400 hover:text-green-primary"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={handleTogglePin}
          className="text-gray-400 hover:text-green-primary"
          title={task.isPinned ? 'Unpin' : 'Pin'}
        >
          {task.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
        </button>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-error"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
