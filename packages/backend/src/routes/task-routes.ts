import { Router } from "express";
import * as taskController from "../controllers/task-controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";

const router = Router();

// List tasks (any member can view)
router.get("/", authenticate, requireTenant, taskController.list);

// Create task (any member can create)
router.post("/", authenticate, requireTenant, taskController.create);

// Update task (any member can update)
router.patch("/:id", authenticate, requireTenant, taskController.update);

// Delete task (owner can delete any, member can delete own only - enforced in service)
router.delete("/:id", authenticate, requireTenant, taskController.remove);

export { router as taskRoutes };
