// Local
import { pool } from "../config/db.js";
import { AppError } from "../utils/errors.js";
import type { Queryable } from "../utils/transaction.js";
import type { Organization, OrgRow } from "../types/organization.js";

export const orgRepository = {
  async findAll(
    query?: string,
    limit = 20,
    offset = 0,
  ): Promise<Organization[]> {
    const params: unknown[] = [limit, offset];
    let whereClause = "";

    if (query) {
      whereClause = "WHERE name ILIKE $3";
      params.push(`%${query}%`);
    }

    const result = await pool.query<OrgRow>(
      `SELECT id, name, slug, description, created_at, updated_at
       FROM organizations ${whereClause}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params,
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

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

  async create(
    data: {
      name: string;
      slug: string;
      description?: string;
    },
    client?: Queryable,
  ): Promise<Organization> {
    const db = client ?? pool;
    const result = await db.query<OrgRow>(
      `INSERT INTO organizations (name, slug, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, slug, description, created_at, updated_at`,
      [data.name, data.slug, data.description || null],
    );

    const row = result.rows[0];
    if (!row) {
      throw new AppError("Failed to create organization");
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

  async delete(id: string, client?: Queryable): Promise<boolean> {
    const db = client ?? pool;
    const result = await db.query("DELETE FROM organizations WHERE id = $1", [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
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
