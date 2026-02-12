import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { getAuthState } from '../../../mock/auth';
import { getTasksByOrg, createTask, updateTask, deleteTask } from '../../../mock/tasks';
import { getMembersByOrg } from '../../../mock/members';
import { TaskStatsCards } from '../components/TaskStatsCards';
import { TaskTable } from '../components/TaskTable';
import { CreateTaskDialog } from '../components/CreateTaskDialog';
import type { Task } from '../../../types/task';
import type { Membership } from '../../../types/membership';

const TasksPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const auth = getAuthState()!;

  const [tasks, setTasks] = useState<Task[]>(() => getTasksByOrg(currentOrgId));
  const [members] = useState<Membership[]>(() => getMembersByOrg(currentOrgId));
  const [dialogOpen, setDialogOpen] = useState(false);

  const refreshTasks = useCallback(() => {
    setTasks(getTasksByOrg(currentOrgId));
  }, [currentOrgId]);

  const handleCreate = useCallback(
    (title: string) => {
      createTask(currentOrgId, auth.user.id, title);
      refreshTasks();
    },
    [currentOrgId, auth.user.id, refreshTasks],
  );

  const handleToggleDone = useCallback(
    (taskId: string, isDone: boolean) => {
      updateTask(taskId, { isDone });
      refreshTasks();
    },
    [refreshTasks],
  );

  const handleTogglePin = useCallback(
    (taskId: string, isPinned: boolean) => {
      updateTask(taskId, { isPinned });
      refreshTasks();
    },
    [refreshTasks],
  );

  const handleDelete = useCallback(
    (taskId: string) => {
      deleteTask(taskId);
      refreshTasks();
    },
    [refreshTasks],
  );

  return (
    <div className="flex flex-col gap-8 p-8 px-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[42px] font-bold leading-none tracking-tight text-white">
            TASKS
          </h1>
          <p className="font-mono text-sm font-normal text-gray-500">
            Manage and track your team tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 bg-green-primary px-4 py-2.5 font-mono text-[11px] font-bold text-black-on-accent hover:brightness-90"
          >
            <Plus size={14} />
            NEW TASK
          </button>
        </div>
      </div>

      {/* Stats */}
      <TaskStatsCards tasks={tasks} members={members} />

      {/* Table */}
      <TaskTable
        tasks={tasks}
        onToggleDone={handleToggleDone}
        onTogglePin={handleTogglePin}
        onDelete={handleDelete}
      />

      {/* Create Dialog */}
      <CreateTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default TasksPage;
