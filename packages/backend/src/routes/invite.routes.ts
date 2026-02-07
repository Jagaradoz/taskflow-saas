import { Router } from "express";
import * as inviteController from "../controllers/invite.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

// Org-scoped invite routes (owner only)
router.post(
  "/orgs/:orgId/invites",
  authenticate,
  requireTenant,
  authorize("owner"),
  inviteController.create,
);

router.get(
  "/orgs/:orgId/invites",
  authenticate,
  requireTenant,
  authorize("owner"),
  inviteController.list,
);

router.delete(
  "/orgs/:orgId/invites/:id",
  authenticate,
  requireTenant,
  authorize("owner"),
  inviteController.revoke,
);

// User-scoped invite routes
router.get("/me/invites", authenticate, inviteController.getMyInvites);
router.post("/me/invites/:id/accept", authenticate, inviteController.accept);
router.post("/me/invites/:id/decline", authenticate, inviteController.decline);

export { router as inviteRoutes };
