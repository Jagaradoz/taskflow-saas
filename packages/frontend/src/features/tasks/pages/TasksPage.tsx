import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useDashboardContext } from '../../../hooks/useDashboardContext';
import { TaskStatsCards } from '../components/TaskStatsCards';
import { TaskTable } from '../components/TaskTable';
import { CreateTaskDialog } from '../components/CreateTaskDialog';
import { EditTaskDialog } from '../components/EditTaskDialog';
import type { Task } from '../../../types/task';
import { useTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../hooks/use-tasks';
import { useMembersQuery } from '@/features/members/hooks/use-members';

const TasksPage: React.FC = () => {
  const { currentOrgId } = useDashboardContext();
  const { data: tasks = [] } = useTasksQuery(currentOrgId);
  const { data: members = [] } = useMembersQuery(currentOrgId);
  const createTaskMutation = useCreateTaskMutation(currentOrgId);
  const updateTaskMutation = useUpdateTaskMutation(currentOrgId);
  const deleteTaskMutation = useDeleteTaskMutation(currentOrgId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreate = useCallback(
    async (title: string, description?: string) => {
      await createTaskMutation.mutateAsync({ title, description });
    },
    [createTaskMutation],
  );

  const handleToggleDone = useCallback(
    async (taskId: string, isDone: boolean) => {
      await updateTaskMutation.mutateAsync({ taskId, updates: { isDone } });
    },
    [updateTaskMutation],
  );

  const handleTogglePin = useCallback(
    async (taskId: string, isPinned: boolean) => {
      await updateTaskMutation.mutateAsync({ taskId, updates: { isPinned } });
    },
    [updateTaskMutation],
  );

  const handleDelete = useCallback(
    async (taskId: string) => {
      await deleteTaskMutation.mutateAsync(taskId);
    },
    [deleteTaskMutation],
  );

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleSaveEdit = useCallback(
    async (updates: { title: string; description?: string }) => {
      if (!editingTask) return;
      await updateTaskMutation.mutateAsync({ taskId: editingTask.id, updates });
      setEditingTask(null);
    },
    [editingTask, updateTaskMutation],
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:px-10 lg:py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] font-bold leading-none tracking-tight text-white sm:text-[36px] lg:text-[42px]">
            TASKS
          </h1>
          <p className="font-mono text-sm font-normal text-gray-500">
            Manage and track your team tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDialogOpen(true)}
            className="flex h-10 w-full items-center justify-center gap-2 bg-green-primary px-4 py-2.5 font-mono text-[11px] font-bold text-black-on-accent hover:brightness-90 sm:w-auto"
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
        onEdit={handleEdit}
      />

      {/* Create Dialog */}
      <CreateTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />

      {/* Edit Dialog */}
      <EditTaskDialog
        open={editingTask !== null}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
        task={editingTask}
      />
    </div>
  );
};

export default TasksPage;
