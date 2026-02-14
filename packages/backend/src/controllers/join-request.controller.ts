// Third-party
import type { Request, Response } from "express";

// Modules
import { joinRequestService } from "../services/join-request.service.js";
import {
  createRequestSchema,
  approveRequestSchema,
} from "../validators/join-request.schema.js";
import { ValidationError, ForbiddenError, UnauthorizedError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Types
import "../types/express.type.js";

// @route POST /api/orgs/:slug/requests
// @desc  Create join request
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const slug = req.params.slug;

    // Validate user
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }
    if (!slug) {
      throw new ValidationError("Organization slug is required");
    }

    // Validate request body
    const parseResult = createRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    // Create a join request
    const request = await joinRequestService.createRequest(
      slug,
      userId,
      parseResult.data.message,
    );

    sendSuccess(res, { request }, 201);
  } catch (error) {
    sendError(error, res, "create");
  }
}

// @route GET /api/orgs/:orgId/requests
// @desc  List org requests (owner only)
export async function list(req: Request, res: Response): Promise<void> {
  try {
    const sessionOrgId = req.currentOrgId;
    const paramOrgId = req.params.orgId;

    // Validate organization
    if (!sessionOrgId) {
      throw new ValidationError("Organization not selected");
    }
    if (paramOrgId && paramOrgId !== sessionOrgId) {
      throw new ForbiddenError(
        "Organization ID mismatch. You are currently browsing a different organization.",
      );
    }

    // Validate status
    const validStatuses = ["pending", "accepted", "declined", "rejected", "revoked"] as const;
    const statusParam = req.query.status as string | undefined;
    if (statusParam && !validStatuses.includes(statusParam as typeof validStatuses[number])) {
      throw new ValidationError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    // List org requests
    const status = statusParam as typeof validStatuses[number] | undefined;
    const requests = await joinRequestService.listOrgRequests(sessionOrgId, status);

    sendSuccess(res, { requests });
  } catch (error) {
    sendError(error, res, "list");
  }
}

// @route POST /api/orgs/:orgId/requests/:id/approve
// @desc  Approve request (owner only)
export async function approve(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const resolvedBy = req.user?.id;
    const requestId = req.params.id;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (req.params.orgId && req.params.orgId !== orgId) {
      throw new ForbiddenError(
        "Organization ID mismatch. You are currently browsing a different organization.",
      );
    }

    // Validate user
    if (!resolvedBy) {
      throw new UnauthorizedError("User not found in session");
    }

    // Validate request ID
    if (!requestId) {
      throw new ValidationError("Request ID is required");
    }

    // Validate request body
    const parseResult = approveRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    const { role } = parseResult.data;

    // Approve request
    const membership = await joinRequestService.approveRequest(
      requestId,
      orgId,
      resolvedBy,
      role,
    );
    sendSuccess(res, { membership });
  } catch (error) {
    sendError(error, res, "approve");
  }
}

// @route POST /api/orgs/:orgId/requests/:id/reject
// @desc  Reject request (owner only)
export async function reject(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const resolvedBy = req.user?.id;
    const requestId = req.params.id;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (req.params.orgId && req.params.orgId !== orgId) {
      throw new ForbiddenError(
        "Organization ID mismatch. You are currently browsing a different organization.",
      );
    }

    // Validate user
    if (!resolvedBy) {
      throw new UnauthorizedError("User not found in session");
    }

    // Validate request ID
    if (!requestId) {
      throw new ValidationError("Request ID is required");
    }

    // Reject request
    await joinRequestService.rejectRequest(requestId, orgId, resolvedBy);
    sendSuccess(res, { message: "Request rejected successfully" });
  } catch (error) {
    sendError(error, res, "reject");
  }
}

// @route GET /api/me/requests
// @desc  Get my pending requests
export async function getMyRequests(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.user?.id;

    // Validate user
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }

    // Get my requests
    const requests = await joinRequestService.getMyRequests(userId);

    sendSuccess(res, { requests });
  } catch (error) {
    sendError(error, res, "getMyRequests");
  }
}

// @route DELETE /api/me/requests/:id
// @desc  Cancel my request
export async function cancel(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const requestId = req.params.id;

    // Validate user
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }

    // Validate request ID
    if (!requestId) {
      throw new ValidationError("Request ID is required");
    }

    // Cancel request
    await joinRequestService.cancelRequest(requestId, userId);

    sendSuccess(res, { message: "Request cancelled successfully" });
  } catch (error) {
    sendError(error, res, "cancel");
  }
}
