// Third-party
import { Router } from "express";

// Modules
import * as taskController from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";

const router = Router();

router.get("/", authenticate, requireTenant, taskController.list);
router.post("/", authenticate, requireTenant, taskController.create);
router.patch("/:id", authenticate, requireTenant, taskController.update);
router.delete("/:id", authenticate, requireTenant, taskController.remove);

export { router as taskRoutes };
