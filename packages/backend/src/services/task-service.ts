// Local
import { taskRepository } from "../repositories/task-repository.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { cacheService, cacheKeys, cacheTTL } from "./cache-service.js";
import type { MemberRole } from "../types/membership.js";

export const taskService = {
  async listTasks(orgId: string) {
    const cacheKey = cacheKeys.tasks(orgId);

    // Check cache first
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const tasks = await taskRepository.findByOrgId(orgId);

    // Cache the result
    await cacheService.set(cacheKey, tasks, cacheTTL.tasks);

    return tasks;
  },

  async createTask(
    orgId: string,
    userId: string,
    title: string,
    description?: string | null,
  ) {
    const task = await taskRepository.create({
      orgId,
      createdBy: userId,
      title,
      description,
    });

    // Invalidate cache
    await cacheService.del(cacheKeys.tasks(orgId));

    return task;
  },

  async updateTask(
    taskId: string,
    orgId: string,
    userId: string,
    userRole: MemberRole,
    updates: {
      title?: string;
      description?: string | null;
      isDone?: boolean;
      isPinned?: boolean;
    },
  ) {
    const task = await taskRepository.findById(taskId, orgId);
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    // Authorization: Owner can update any task, member can only update own tasks
    if (userRole !== "owner" && task.createdBy !== userId) {
      throw new ForbiddenError("You can only update tasks you created");
    }

    const updated = await taskRepository.update(taskId, orgId, updates);
    if (!updated) {
      throw new NotFoundError("Task not found");
    }

    // Invalidate cache
    await cacheService.del(cacheKeys.tasks(orgId));

    return updated;
  },

  async deleteTask(
    taskId: string,
    orgId: string,
    userId: string,
    userRole: MemberRole,
  ) {
    const task = await taskRepository.findById(taskId, orgId);
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    // Authorization: Owner can delete any task, member can only delete own tasks
    if (userRole !== "owner" && task.createdBy !== userId) {
      throw new ForbiddenError("You can only delete tasks you created");
    }

    const deleted = await taskRepository.delete(taskId, orgId);
    if (!deleted) {
      throw new NotFoundError("Task not found");
    }

    // Invalidate cache
    await cacheService.del(cacheKeys.tasks(orgId));

    return true;
  },
};
