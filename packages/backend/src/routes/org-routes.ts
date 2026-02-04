// Libraries
import { Router } from "express";

// Local
import { orgController } from "../controllers/org-controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

// Create org (authenticated, no tenant required - creates new org)
router.post("/", authenticate, (req, res) => orgController.create(req, res));

// Get org (authenticated + member of org)
router.get("/:id", authenticate, (req, res) => orgController.getById(req, res));

// Update org (authenticated + tenant + owner only)
router.patch(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  (req, res) => orgController.update(req, res),
);

// Switch active org (authenticated only)
router.post("/:id/switch", authenticate, (req, res) =>
  orgController.switch(req, res),
);

export { router as orgRoutes };
