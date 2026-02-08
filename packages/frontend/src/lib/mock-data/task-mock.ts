/**
 * Mock Task Operations
 */

import type { Task } from "@/types/task";
import { STORAGE_KEYS } from "./types";
import { MOCK_TASKS } from "./fixtures";
import { getAuthState } from "./auth-mock";
import { getMembers } from "./member-mock";

function getTasks(): Task[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  return stored ? JSON.parse(stored) : MOCK_TASKS;
}

function setTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getTasksByOrg(orgId: string): Task[] {
  return getTasks()
    .filter((t) => t.orgId === orgId)
    .sort((a, b) => {
      // Pinned first, then by created date desc
      if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function createTask(
  orgId: string,
  userId: string,
  title: string,
  description?: string,
): Task {
  const state = getAuthState();
  const task: Task = {
    id: `task-${Date.now()}`,
    orgId,
    createdBy: userId,
    creatorName: state.user?.name || "Unknown",
    title,
    description,
    isDone: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const tasks = getTasks();
  tasks.push(task);
  setTasks(tasks);
  return task;
}

export function updateTask(
  taskId: string,
  updates: Partial<Pick<Task, "title" | "description" | "isDone" | "isPinned">>,
): Task | null {
  const tasks = getTasks();
  const existingTask = tasks.find((t) => t.id === taskId);
  if (!existingTask) return null;

  const index = tasks.indexOf(existingTask);
  const updatedTask: Task = {
    ...existingTask,
    ...updates,
    // Explicitly preserve required fields to satisfy TypeScript
    id: existingTask.id,
    orgId: existingTask.orgId,
    createdBy: existingTask.createdBy,
    creatorName: existingTask.creatorName,
    title: updates.title ?? existingTask.title,
    isDone: updates.isDone ?? existingTask.isDone,
    isPinned: updates.isPinned ?? existingTask.isPinned,
    createdAt: existingTask.createdAt,
    updatedAt: new Date().toISOString(),
  };
  tasks[index] = updatedTask;

  setTasks(tasks);
  return tasks[index];
}

export function deleteTask(taskId: string): boolean {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return false;

  tasks.splice(index, 1);
  setTasks(tasks);
  return true;
}

export function getTaskStats(orgId: string): {
  total: number;
  completed: number;
  pinned: number;
  teamSize: number;
} {
  const tasks = getTasksByOrg(orgId);
  const members = getMembers(orgId);

  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.isDone).length,
    pinned: tasks.filter((t) => t.isPinned).length,
    teamSize: members.length,
  };
}
