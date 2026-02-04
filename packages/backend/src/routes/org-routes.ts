import { Router } from "express";
import * as orgController from "../controllers/org-controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

// Create org (authenticated, no tenant required - creates new org)
router.post("/", authenticate, orgController.create);

// Get org (authenticated + member of org)
router.get("/:id", authenticate, orgController.getById);

// Update org (authenticated + tenant + owner only)
router.patch(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  orgController.update,
);

// Switch active org (authenticated only)
router.post("/:id/switch", authenticate, orgController.switchOrg);

export { router as orgRoutes };
