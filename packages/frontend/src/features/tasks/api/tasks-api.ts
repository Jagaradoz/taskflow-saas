import { apiClient } from '@/lib/api-client';
import type { Task } from '@/types/task';

interface CreateTaskInput {
  title: string;
  description?: string;
}

type UpdateTaskInput = Partial<Pick<Task, 'title' | 'description' | 'isDone' | 'isPinned'>>;

export const tasksApi = {
  list: () => apiClient<{ tasks: Task[] }>('/api/tasks'),

  create: (payload: CreateTaskInput) =>
    apiClient<{ task: Task }>('/api/tasks', {
      method: 'POST',
      body: payload,
    }),

  update: (taskId: string, payload: UpdateTaskInput) =>
    apiClient<{ task: Task }>(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: payload,
    }),

  delete: (taskId: string) =>
    apiClient<{ message: string }>(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    }),
};

