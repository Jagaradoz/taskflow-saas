// Local
import { memberRepository } from "../repositories/MemberRepository.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import type { MemberRole } from "../types/index.js";

export const memberService = {
  async listMembers(orgId: string) {
    return memberRepository.findByOrgId(orgId);
  },

  async updateRole(
    membershipId: string,
    currentOrgId: string,
    newRole: MemberRole,
  ) {
    const membership = await memberRepository.findById(membershipId);
    if (!membership) {
      throw new NotFoundError("Membership not found");
    }

    if (membership.orgId !== currentOrgId) {
      throw new ForbiddenError(
        "Membership does not belong to current organization",
      );
    }

    // Prevent demoting the last owner
    if (membership.role === "owner" && newRole === "member") {
      const ownerCount =
        await memberRepository.countOwnersByOrgId(currentOrgId);
      if (ownerCount <= 1) {
        throw new ForbiddenError("Cannot demote the last owner");
      }
    }

    const updated = await memberRepository.updateRole(membershipId, newRole);
    if (!updated) {
      throw new NotFoundError("Membership not found");
    }

    return updated;
  },

  async removeMember(
    membershipId: string,
    currentOrgId: string,
    currentUserId: string,
  ) {
    const membership = await memberRepository.findById(membershipId);
    if (!membership) {
      throw new NotFoundError("Membership not found");
    }

    if (membership.orgId !== currentOrgId) {
      throw new ForbiddenError(
        "Membership does not belong to current organization",
      );
    }

    // Prevent removing yourself
    if (membership.userId === currentUserId) {
      throw new ForbiddenError("Cannot remove yourself from the organization");
    }

    // Prevent removing the last owner
    if (membership.role === "owner") {
      const ownerCount =
        await memberRepository.countOwnersByOrgId(currentOrgId);
      if (ownerCount <= 1) {
        throw new ForbiddenError("Cannot remove the last owner");
      }
    }

    const deleted = await memberRepository.delete(membershipId);
    if (!deleted) {
      throw new NotFoundError("Membership not found");
    }

    return true;
  },
};
