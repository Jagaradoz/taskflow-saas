// Local
import { membershipRequestRepository } from "../repositories/membership-request.repository.js";
import { memberRepository } from "../repositories/member-repository.js";
import { userRepository } from "../repositories/user-repository.js";
import { cacheService, cacheKeys } from "./cache-service.js";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../utils/errors.js";
import type { MembershipRequestStatus } from "../types/membership-request.js";

export const inviteService = {
  async createInvite(
    orgId: string,
    targetUserId: string,
    role: "member",
    invitedBy: string,
  ) {
    // Check if target user exists
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    // Check if user is already a member
    const existingMembership = await memberRepository.findByUserAndOrg(
      targetUserId,
      orgId,
    );
    if (existingMembership) {
      throw new ValidationError(
        "User is already a member of this organization",
      );
    }

    // Check for duplicate pending invite
    const hasPendingInvite =
      await membershipRequestRepository.checkDuplicatePendingInvite(
        orgId,
        targetUserId,
      );
    if (hasPendingInvite) {
      throw new ValidationError("User already has a pending invite");
    }

    const invite = await membershipRequestRepository.create({
      orgId,
      type: "invite",
      invitedUserId: targetUserId,
      invitedBy,
      role,
    });

    return invite;
  },

  async listOrgInvites(orgId: string, status?: MembershipRequestStatus) {
    return membershipRequestRepository.findByOrgId(orgId, "invite", status);
  },

  async revokeInvite(inviteId: string, orgId: string, revokedBy: string) {
    const invite = await membershipRequestRepository.findById(inviteId);
    if (!invite) {
      throw new NotFoundError("Invite not found");
    }

    if (invite.orgId !== orgId) {
      throw new ForbiddenError("Invite does not belong to this organization");
    }

    if (invite.type !== "invite") {
      throw new ValidationError("Not an invite");
    }

    if (invite.status !== "pending") {
      throw new ValidationError("Invite is not pending");
    }

    return membershipRequestRepository.updateStatus(
      inviteId,
      "revoked",
      revokedBy,
    );
  },

  async getMyInvites(userId: string) {
    return membershipRequestRepository.findByInvitedUserId(userId, "pending");
  },

  async acceptInvite(inviteId: string, userId: string) {
    const invite = await membershipRequestRepository.findById(inviteId);
    if (!invite) {
      throw new NotFoundError("Invite not found");
    }

    if (invite.invitedUserId !== userId) {
      throw new ForbiddenError("This invite is not for you");
    }

    if (invite.type !== "invite") {
      throw new ValidationError("Not an invite");
    }

    if (invite.status !== "pending") {
      throw new ValidationError("Invite is not pending");
    }

    // Check if user is already a member (edge case: joined via other means)
    const existingMembership = await memberRepository.findByUserAndOrg(
      userId,
      invite.orgId,
    );
    if (existingMembership) {
      throw new ValidationError(
        "You are already a member of this organization",
      );
    }

    // Create membership
    const membership = await memberRepository.create({
      userId,
      orgId: invite.orgId,
      role: "member",
    });

    // Update invite status
    await membershipRequestRepository.updateStatus(
      inviteId,
      "accepted",
      userId,
    );

    // Invalidate members cache and user's cache
    await cacheService.del(cacheKeys.members(invite.orgId));
    await cacheService.del(cacheKeys.user(userId));

    return membership;
  },

  async declineInvite(inviteId: string, userId: string) {
    const invite = await membershipRequestRepository.findById(inviteId);
    if (!invite) {
      throw new NotFoundError("Invite not found");
    }

    if (invite.invitedUserId !== userId) {
      throw new ForbiddenError("This invite is not for you");
    }

    if (invite.type !== "invite") {
      throw new ValidationError("Not an invite");
    }

    if (invite.status !== "pending") {
      throw new ValidationError("Invite is not pending");
    }

    return membershipRequestRepository.updateStatus(
      inviteId,
      "declined",
      userId,
    );
  },
};
