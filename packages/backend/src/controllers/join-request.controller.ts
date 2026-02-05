import type { Request, Response } from "express";
import { joinRequestService } from "../services/join-request.service.js";
import {
  createRequestSchema,
  resolveRequestSchema,
} from "../validators/join-request.schema.js";
import { ValidationError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";
import "../types/express.js";

// @route POST /api/orgs/:slug/requests
// @desc  Create join request
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const slug = req.params.slug;

    if (!userId) {
      throw new ValidationError("User not found in session");
    }
    if (!slug) {
      throw new ValidationError("Organization slug is required");
    }

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
// @desc  List org requests (owner/admin only)
export async function list(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    const status = req.query.status as string | undefined;
    const requests = await joinRequestService.listOrgRequests(
      orgId,
      status as
        | "pending"
        | "accepted"
        | "declined"
        | "rejected"
        | "revoked"
        | undefined,
    );

    sendSuccess(res, { requests });
  } catch (error) {
    sendError(error, res, "list");
  }
}

// @route PATCH /api/orgs/:orgId/requests/:id
// @desc  Resolve request (owner/admin only)
export async function resolve(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const resolvedBy = req.user?.id;
    const requestId = req.params.id;

    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (!resolvedBy) {
      throw new ValidationError("User not found in session");
    }
    if (!requestId) {
      throw new ValidationError("Request ID is required");
    }

    const parseResult = resolveRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    const { action, role } = parseResult.data;

    if (action === "approve") {
      const membership = await joinRequestService.approveRequest(
        requestId,
        resolvedBy,
        role,
      );
      sendSuccess(res, { membership });
    } else {
      await joinRequestService.rejectRequest(requestId, resolvedBy);
      sendSuccess(res, { message: "Request rejected successfully" });
    }
  } catch (error) {
    sendError(error, res, "resolve");
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
    if (!userId) {
      throw new ValidationError("User not found in session");
    }

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

    if (!userId) {
      throw new ValidationError("User not found in session");
    }
    if (!requestId) {
      throw new ValidationError("Request ID is required");
    }

    await joinRequestService.cancelRequest(requestId, userId);

    sendSuccess(res, { message: "Request cancelled successfully" });
  } catch (error) {
    sendError(error, res, "cancel");
  }
}
