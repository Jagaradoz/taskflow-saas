// Local
import { pool } from "../config/db.js";
import type { Organization } from "../types/index.js";

interface OrgRow {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export const orgRepository = {
  async findById(id: string): Promise<Organization | null> {
    const result = await pool.query<OrgRow>(
      "SELECT id, name, slug, created_at, updated_at FROM organizations WHERE id = $1",
      [id],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async findBySlug(slug: string): Promise<Organization | null> {
    const result = await pool.query<OrgRow>(
      "SELECT id, name, slug, created_at, updated_at FROM organizations WHERE slug = $1",
      [slug],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async create(data: { name: string; slug: string }): Promise<Organization> {
    const result = await pool.query<OrgRow>(
      `INSERT INTO organizations (name, slug)
       VALUES ($1, $2)
       RETURNING id, name, slug, created_at, updated_at`,
      [data.name, data.slug],
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error("Failed to create organization");
    }
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async update(
    id: string,
    data: { name?: string },
  ): Promise<Organization | null> {
    const result = await pool.query<OrgRow>(
      `UPDATE organizations
       SET name = COALESCE($2, name), updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, slug, created_at, updated_at`,
      [id, data.name],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  async slugExists(slug: string): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      "SELECT EXISTS(SELECT 1 FROM organizations WHERE slug = $1) as exists",
      [slug],
    );
    return result.rows[0]?.exists ?? false;
  },
};
