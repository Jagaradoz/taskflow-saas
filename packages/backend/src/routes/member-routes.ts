import { Router } from "express";
import * as memberController from "../controllers/member-controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

// List members (any member can view)
router.get("/", authenticate, requireTenant, memberController.list);

// Update member role (owner only)
router.patch(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  memberController.update,
);

// Remove member (owner only)
router.delete(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  memberController.remove,
);

export { router as memberRoutes };
