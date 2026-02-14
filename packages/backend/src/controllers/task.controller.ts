// Third-party
import type { Request, Response } from "express";

// Modules
import { taskService } from "../services/task.service.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.schema.js";
import { ValidationError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Types
import "../types/express.type.js";

// @route GET /api/tasks
// @desc  List tasks (any member can view)
export async function list(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    // List tasks
    const tasks = await taskService.listTasks(orgId);

    sendSuccess(res, { tasks });
  } catch (error) {
    sendError(error, res, "list");
  }
}

// @route POST /api/tasks
// @desc  Create task (any member can create)
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const userId = req.user?.id;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    // Validate user
    if (!userId) {
      throw new ValidationError("User not found in session");
    }

    const parseResult = createTaskSchema.safeParse(req.body);

    // Validate request body
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    // Create task
    const task = await taskService.createTask(
      orgId,
      userId,
      parseResult.data.title,
      parseResult.data.description,
    );

    sendSuccess(res, { task }, 201);
  } catch (error) {
    sendError(error, res, "create");
  }
}

// @route PATCH /api/tasks/:id
// @desc  Update task (owner can update any, member can update own only)
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const userId = req.user?.id;
    const userRole = req.membership?.role;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    // Validate user
    if (!userId) {
      throw new ValidationError("User not found in session");
    }

    // Validate user role
    if (!userRole) {
      throw new ValidationError("User role not found");
    }

    const taskId = req.params.id;

    // Validate task
    if (!taskId) {
      throw new ValidationError("Task ID is required");
    }

    const parseResult = updateTaskSchema.safeParse(req.body);

    // Validate request body
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    // Update task
    const task = await taskService.updateTask(
      taskId,
      orgId,
      userId,
      userRole,
      parseResult.data,
    );

    sendSuccess(res, { task });
  } catch (error) {
    sendError(error, res, "update");
  }
}

// @route DELETE /api/tasks/:id
// @desc  Delete task (owner can delete any, member can delete own only)
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const userId = req.user?.id;
    const userRole = req.membership?.role;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    // Validate user
    if (!userId) {
      throw new ValidationError("User not found in session");
    }

    // Validate user role
    if (!userRole) {
      throw new ValidationError("User role not found");
    }

    const taskId = req.params.id;

    // Validate task
    if (!taskId) {
      throw new ValidationError("Task ID is required");
    }

    // Delete task
    await taskService.deleteTask(taskId, orgId, userId, userRole);

    sendSuccess(res, { message: "Task deleted successfully" });
  } catch (error) {
    sendError(error, res, "remove");
  }
}
