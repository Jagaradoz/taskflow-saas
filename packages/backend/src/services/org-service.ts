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
import { withTransaction } from "../utils/transaction.js";
import type {
  CreateOrgInput,
  UpdateOrgInput,
} from "../validators/org.schema.js";

const MAX_SLUG_RETRIES = 3;

function generateSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);

  if (!slug) {
    return nanoid(8);
  }

  return slug;
}

export const orgService = {
  async createOrg(userId: string, input: CreateOrgInput) {
    const nameExists = await orgRepository.nameExists(input.name);
    if (nameExists) {
      throw new ValidationError("Organization name already exists");
    }

    let slug = generateSlug(input.name);

    // Ensure unique slug with retry
    for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt++) {
      const exists = await orgRepository.slugExists(slug);
      if (!exists) break;
      slug = `${generateSlug(input.name)}-${nanoid(6)}`;
    }

    // Create org and owner membership atomically
    const org = await withTransaction(async (client) => {
      const newOrg = await orgRepository.create(
        { name: input.name, slug, description: input.description },
        client,
      );

      await memberRepository.create(
        { userId, orgId: newOrg.id, role: "owner" },
        client,
      );

      return newOrg;
    });

    // Invalidate user cache (outside transaction)
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

  async deleteOrg(orgId: string, userId: string) {
    const org = await orgRepository.findById(orgId);
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    // Get all member userIds before deletion (for cache invalidation)
    const members = await memberRepository.findByOrgId(orgId);
    const memberUserIds = members.map((m) => m.userId);

    await withTransaction(async (client) => {
      await orgRepository.delete(orgId, client);
    });

    // Invalidate caches for all affected users
    await Promise.all(
      memberUserIds.map((uid) => cacheService.del(cacheKeys.user(uid))),
    );
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
