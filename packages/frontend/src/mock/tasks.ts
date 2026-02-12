import type { Task } from '../types/task';
import { load, save, uid } from './store';

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const getTasksByOrg = (orgId: string): Task[] => {
    const store = load();
    return store.tasks.filter((t) => t.orgId === orgId);
};

export const createTask = (orgId: string, userId: string, title: string): Task => {
    const store = load();
    const user = store.users.find((u) => u.id === userId);
    const ts = new Date().toISOString();
    const task: Task = {
        id: uid(),
        orgId,
        createdBy: userId,
        creatorName: user?.name ?? 'Unknown',
        title,
        description: undefined,
        isDone: false,
        isPinned: false,
        createdAt: ts,
        updatedAt: ts,
    };
    store.tasks.push(task);
    save(store);
    return task;
};

export const updateTask = (
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'isDone' | 'isPinned'>>,
): Task | null => {
    const store = load();
    const task = store.tasks.find((t) => t.id === taskId);
    if (!task) return null;
    Object.assign(task, updates, { updatedAt: new Date().toISOString() });
    save(store);
    return task;
};

export const deleteTask = (taskId: string): boolean => {
    const store = load();
    const idx = store.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return false;
    store.tasks.splice(idx, 1);
    save(store);
    return true;
};
