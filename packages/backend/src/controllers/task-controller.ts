import type { Request, Response } from "express";
import { taskService } from "../services/task-service.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.schema.js";
import { ValidationError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";
import "../types/express.js";

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    const tasks = await taskService.listTasks(orgId);

    sendSuccess(res, { tasks });
  } catch (error) {
    sendError(error, res, "list");
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const userId = req.user?.id;

    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (!userId) {
      throw new ValidationError("User not found in session");
    }

    const parseResult = createTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    const task = await taskService.createTask(
      orgId,
      userId,
      parseResult.data.title,
    );

    sendSuccess(res, { task }, 201);
  } catch (error) {
    sendError(error, res, "create");
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    const taskId = req.params.id;
    if (!taskId) {
      throw new ValidationError("Task ID is required");
    }

    const parseResult = updateTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    const task = await taskService.updateTask(taskId, orgId, parseResult.data);

    sendSuccess(res, { task });
  } catch (error) {
    sendError(error, res, "update");
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const userId = req.user?.id;
    const userRole = req.membership?.role;

    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (!userId) {
      throw new ValidationError("User not found in session");
    }
    if (!userRole) {
      throw new ValidationError("User role not found");
    }

    const taskId = req.params.id;
    if (!taskId) {
      throw new ValidationError("Task ID is required");
    }

    await taskService.deleteTask(taskId, orgId, userId, userRole);

    sendSuccess(res, { message: "Task deleted successfully" });
  } catch (error) {
    sendError(error, res, "remove");
  }
}
