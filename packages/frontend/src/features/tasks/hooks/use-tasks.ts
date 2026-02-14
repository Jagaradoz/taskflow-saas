import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks-api';

export function tasksQueryKey(orgId: string) {
  return ['tasks', orgId] as const;
}

export function useTasksQuery(orgId: string) {
  return useSuspenseQuery({
    queryKey: tasksQueryKey(orgId),
    queryFn: async () => {
      const data = await tasksApi.list();
      return data.tasks;
    },
  });
}

export function useCreateTaskMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description?: string }) => tasksApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKey(orgId) });
    },
  });
}

export function useUpdateTaskMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<{ title: string; description?: string; isDone: boolean; isPinned: boolean }> }) =>
      tasksApi.update(taskId, updates),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKey(orgId) });
    },
  });
}

export function useDeleteTaskMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(taskId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksQueryKey(orgId) });
    },
  });
}
