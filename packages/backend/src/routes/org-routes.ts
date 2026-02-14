import { Router } from "express";
import * as orgController from "../controllers/org-controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.post("/", authenticate, orgController.create);
router.get("/:id", authenticate, orgController.getById);

router.patch(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  orgController.update,
);

router.delete(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  orgController.deleteOrg,
);

router.post("/:id/switch", authenticate, orgController.switchOrg);

export { router as orgRoutes };
