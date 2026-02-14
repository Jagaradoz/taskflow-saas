import type { Task } from '../../../types/task';
import { TaskRow } from './TaskRow';

interface TaskTableProps {
  tasks: Task[];
  onToggleDone: (taskId: string, isDone: boolean) => void;
  onTogglePin: (taskId: string, isPinned: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const COLUMNS = [
  { label: 'STATUS', width: 'w-[60px]' },
  { label: 'TITLE', width: 'flex-1' },
  { label: 'CREATOR', width: 'w-[160px]' },
  { label: 'FLAGS', width: 'w-[100px]' },
  { label: 'ACTIONS', width: 'w-[80px]' },
] as const;

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onToggleDone,
  onTogglePin,
  onDelete,
  onEdit,
}) => (
  <div className="border border-border bg-bg-card">
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
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
        {tasks.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <span className="font-mono text-xs text-gray-500">No tasks yet</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggleDone={onToggleDone}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  </div>
);
