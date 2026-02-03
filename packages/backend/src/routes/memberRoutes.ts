// Libraries
import { Router } from "express";

// Local
import { memberController } from "../controllers/MemberController.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

// All member routes require authentication and tenant context

// List members (any member can view)
router.get("/", authenticate, requireTenant, (req, res) =>
  memberController.list(req, res),
);

// Update member role (owner only)
router.patch(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  (req, res) => memberController.update(req, res),
);

// Remove member (owner only)
router.delete(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  (req, res) => memberController.remove(req, res),
);

export { router as memberRoutes };
