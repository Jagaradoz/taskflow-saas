import { Router } from "express";
import * as joinRequestController from "../controllers/join-request.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

// Public join request (user just needs to be authenticated)
router.post("/orgs/:slug/requests", authenticate, joinRequestController.create);

// Org-scoped request management (owner only)
router.get(
  "/orgs/:orgId/requests",
  authenticate,
  requireTenant,
  authorize("owner", "admin"),
  joinRequestController.list,
);

router.patch(
  "/orgs/:orgId/requests/:id",
  authenticate,
  requireTenant,
  authorize("owner", "admin"),
  joinRequestController.resolve,
);

// User-scoped request routes
router.get("/me/requests", authenticate, joinRequestController.getMyRequests);
router.delete("/me/requests/:id", authenticate, joinRequestController.cancel);

export { router as joinRequestRoutes };
