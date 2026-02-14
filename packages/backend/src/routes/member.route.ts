// Third-party
import { Router } from "express";

// Modules
import * as memberController from "../controllers/member.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";

const router = Router();

router.get("/", authenticate, requireTenant, memberController.list);

router.delete(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  memberController.remove,
);

export { router as memberRoutes };
