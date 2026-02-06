// Local
import { pool } from "../config/db.js";
import type { Organization, OrgRow } from "../types/organization.js";

export const orgRepository = {
  async findById(id: string): Promise<Organization | null> {
    const result = await pool.query<OrgRow>(
      "SELECT id, name, slug, description, created_at, updated_at FROM organizations WHERE id = $1",
      [id],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async findBySlug(slug: string): Promise<Organization | null> {
    const result = await pool.query<OrgRow>(
      "SELECT id, name, slug, description, created_at, updated_at FROM organizations WHERE slug = $1",
      [slug],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async create(data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Organization> {
    const result = await pool.query<OrgRow>(
      `INSERT INTO organizations (name, slug, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, slug, description, created_at, updated_at`,
      [data.name, data.slug, data.description || null],
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error("Failed to create organization");
    }
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async update(
    id: string,
    data: { name?: string; slug?: string; description?: string | null },
  ): Promise<Organization | null> {
    const result = await pool.query<OrgRow>(
      `UPDATE organizations
       SET name = COALESCE($2, name),
           slug = COALESCE($3, slug),
           description = CASE WHEN $4::boolean THEN $5 ELSE description END,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, slug, description, created_at, updated_at`,
      [
        id,
        data.name,
        data.slug,
        data.description !== undefined,
        data.description !== undefined ? data.description : null,
      ],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      excludeId
        ? "SELECT EXISTS(SELECT 1 FROM organizations WHERE slug = $1 AND id != $2) as exists"
        : "SELECT EXISTS(SELECT 1 FROM organizations WHERE slug = $1) as exists",
      excludeId ? [slug, excludeId] : [slug],
    );
    return result.rows[0]?.exists ?? false;
  },

  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      excludeId
        ? "SELECT EXISTS(SELECT 1 FROM organizations WHERE name = $1 AND id != $2) as exists"
        : "SELECT EXISTS(SELECT 1 FROM organizations WHERE name = $1) as exists",
      excludeId ? [name, excludeId] : [name],
    );
    return result.rows[0]?.exists ?? false;
  },
};
