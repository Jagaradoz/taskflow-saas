// Local
import { membershipRequestRepository } from "../repositories/membership-request.repository.js";
import { memberRepository } from "../repositories/member-repository.js";
import { orgRepository } from "../repositories/org-repository.js";
import { cacheService, cacheKeys } from "./cache-service.js";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../utils/errors.js";
import type { MembershipRequestStatus } from "../types/index.js";

export const joinRequestService = {
  async createRequest(orgSlug: string, userId: string, message?: string) {
    // Find org by slug
    const org = await orgRepository.findBySlug(orgSlug);
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    // Check if user is already a member
    const existingMembership = await memberRepository.findByUserAndOrg(
      userId,
      org.id,
    );
    if (existingMembership) {
      throw new ValidationError(
        "You are already a member of this organization",
      );
    }

    // Check for duplicate pending request
    const hasPendingRequest =
      await membershipRequestRepository.checkDuplicatePendingRequest(
        org.id,
        userId,
      );
    if (hasPendingRequest) {
      throw new ValidationError("You already have a pending request");
    }

    // Check for pending invite (user should accept invite instead)
    const hasPendingInvite =
      await membershipRequestRepository.checkDuplicatePendingInvite(
        org.id,
        userId,
      );
    if (hasPendingInvite) {
      throw new ValidationError(
        "You have a pending invite to this organization. Please accept or decline it.",
      );
    }

    const request = await membershipRequestRepository.create({
      orgId: org.id,
      type: "request",
      requesterId: userId,
      role: "member", // Requests always start as member, owner can upgrade on approval
      message,
    });

    return request;
  },

  async listOrgRequests(orgId: string, status?: MembershipRequestStatus) {
    return membershipRequestRepository.findByOrgId(orgId, "request", status);
  },

  async approveRequest(
    requestId: string,
    approvedBy: string,
    role: "admin" | "member" = "member",
  ) {
    const request = await membershipRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundError("Request not found");
    }

    if (request.type !== "request") {
      throw new ValidationError("Not a join request");
    }

    if (request.status !== "pending") {
      throw new ValidationError("Request is not pending");
    }

    if (!request.requesterId) {
      throw new ValidationError("Request has no requester");
    }

    // Check if user is already a member (edge case)
    const existingMembership = await memberRepository.findByUserAndOrg(
      request.requesterId,
      request.orgId,
    );
    if (existingMembership) {
      throw new ValidationError(
        "User is already a member of this organization",
      );
    }

    // Create membership
    const membership = await memberRepository.create({
      userId: request.requesterId,
      orgId: request.orgId,
      role,
    });

    // Update request status
    await membershipRequestRepository.updateStatus(
      requestId,
      "accepted",
      approvedBy,
    );

    // Invalidate members cache
    await cacheService.del(cacheKeys.members(request.orgId));

    return membership;
  },

  async rejectRequest(requestId: string, rejectedBy: string) {
    const request = await membershipRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundError("Request not found");
    }

    if (request.type !== "request") {
      throw new ValidationError("Not a join request");
    }

    if (request.status !== "pending") {
      throw new ValidationError("Request is not pending");
    }

    return membershipRequestRepository.updateStatus(
      requestId,
      "rejected",
      rejectedBy,
    );
  },

  async getMyRequests(userId: string) {
    return membershipRequestRepository.findByRequesterId(userId);
  },

  async cancelRequest(requestId: string, userId: string) {
    const request = await membershipRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundError("Request not found");
    }

    if (request.requesterId !== userId) {
      throw new ForbiddenError("This request is not yours");
    }

    if (request.type !== "request") {
      throw new ValidationError("Not a join request");
    }

    if (request.status !== "pending") {
      throw new ValidationError("Request is not pending");
    }

    return membershipRequestRepository.updateStatus(
      requestId,
      "revoked",
      userId,
    );
  },
};
