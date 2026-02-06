// Local
import { pool } from "../config/db.js";
import type {
  User,
  UserRow,
  MembershipWithOrgRow,
  UserWithMemberships,
} from "../types/user.js";

export const userRepository = {
  async findByEmail(
    email: string,
  ): Promise<(User & { passwordHash: string }) | null> {
    const result = await pool.query<UserRow>(
      "SELECT id, email, password, name, created_at FROM users WHERE email = $1",
      [email],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password,
      name: row.name,
      createdAt: row.created_at,
    };
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query<UserRow>(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [id],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.created_at,
    };
  },

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
  }): Promise<User> {
    const result = await pool.query<UserRow>(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [data.email, data.passwordHash, data.name],
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error("Failed to create user");
    }
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.created_at,
    };
  },

  async findByIdWithMemberships(
    id: string,
  ): Promise<UserWithMemberships | null> {
    const userResult = await pool.query<UserRow>(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [id],
    );

    const userRow = userResult.rows[0];
    if (!userRow) return null;

    const membershipsResult = await pool.query<MembershipWithOrgRow>(
      `SELECT m.id, m.org_id, o.name as org_name, o.slug as org_slug, m.role
       FROM memberships m
       JOIN organizations o ON o.id = m.org_id
       WHERE m.user_id = $1
       ORDER BY o.name`,
      [id],
    );

    return {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      createdAt: userRow.created_at,
      memberships: membershipsResult.rows.map((row) => ({
        id: row.id,
        orgId: row.org_id,
        orgName: row.org_name,
        orgSlug: row.org_slug,
        role: row.role,
      })),
    };
  },
};
