// Libraries
import { nanoid } from "nanoid";

// Local
import { orgRepository } from "../repositories/org-repository.js";
import { memberRepository } from "../repositories/member-repository.js";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../utils/errors.js";
import { cacheService, cacheKeys } from "./cache-service.js";
import type {
  CreateOrgInput,
  UpdateOrgInput,
} from "../validators/org.schema.js";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export const orgService = {
  async createOrg(userId: string, input: CreateOrgInput) {
    const nameExists = await orgRepository.nameExists(input.name);
    if (nameExists) {
      throw new ValidationError("Organization name already exists");
    }

    let slug = generateSlug(input.name);

    // Ensure unique slug
    const exists = await orgRepository.slugExists(slug);
    if (exists) {
      slug = `${slug}-${nanoid(6)}`;
    }

    const org = await orgRepository.create({
      name: input.name,
      slug,
      description: input.description,
    });

    // Create owner membership
    await memberRepository.create({
      userId,
      orgId: org.id,
      role: "owner",
    });

    // Invalidate user cache to ensure /me returns the new org
    await cacheService.del(cacheKeys.user(userId));

    return org;
  },

  async getOrgById(orgId: string, userId: string) {
    const org = await orgRepository.findById(orgId);
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    // Verify user is a member
    const membership = await memberRepository.findByUserAndOrg(userId, orgId);
    if (!membership) {
      throw new ForbiddenError("Not a member of this organization");
    }

    return org;
  },

  async updateOrg(orgId: string, input: UpdateOrgInput) {
    let slug: string | undefined;
    if (input.name) {
      const nameExists = await orgRepository.nameExists(input.name, orgId);
      if (nameExists) {
        throw new ValidationError("Organization name already exists");
      }

      slug = generateSlug(input.name);
      const exists = await orgRepository.slugExists(slug, orgId);
      if (exists) {
        slug = `${slug}-${nanoid(6)}`;
      }
    }

    const org = await orgRepository.update(orgId, { ...input, slug });
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    return org;
  },

  async switchOrg(userId: string, orgId: string) {
    const org = await orgRepository.findById(orgId);
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    const membership = await memberRepository.findByUserAndOrg(userId, orgId);
    if (!membership) {
      throw new ForbiddenError("Not a member of this organization");
    }

    return org;
  },
};
