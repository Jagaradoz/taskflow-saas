import { Router } from "express";
import * as memberController from "../controllers/member-controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.get("/", authenticate, requireTenant, memberController.list);

router.patch(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  memberController.update,
);

router.delete(
  "/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  memberController.remove,
);

export { router as memberRoutes };
