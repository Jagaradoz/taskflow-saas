// Local
import { pool } from "../config/db.js";
import type {
  Membership,
  MemberRole,
  MembershipRow,
  MemberWithUserRow,
  MemberWithUser,
} from "../types/membership.js";

export const memberRepository = {
  async create(data: {
    userId: string;
    orgId: string;
    role: MemberRole;
  }): Promise<Membership> {
    const result = await pool.query<MembershipRow>(
      `INSERT INTO memberships (user_id, org_id, role)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, org_id, role, created_at`,
      [data.userId, data.orgId, data.role],
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error("Failed to create membership");
    }
    return {
      id: row.id,
      userId: row.user_id,
      orgId: row.org_id,
      role: row.role,
      createdAt: row.created_at,
    };
  },

  async findByUserAndOrg(
    userId: string,
    orgId: string,
  ): Promise<Membership | null> {
    const result = await pool.query<MembershipRow>(
      "SELECT id, user_id, org_id, role, created_at FROM memberships WHERE user_id = $1 AND org_id = $2",
      [userId, orgId],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      orgId: row.org_id,
      role: row.role,
      createdAt: row.created_at,
    };
  },

  async findByOrgId(orgId: string): Promise<MemberWithUser[]> {
    const result = await pool.query<MemberWithUserRow>(
      `SELECT m.id, m.user_id, m.org_id, m.role, m.created_at,
              u.email as user_email, u.name as user_name
       FROM memberships m
       JOIN users u ON u.id = m.user_id
       WHERE m.org_id = $1
       ORDER BY u.name`,
      [orgId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      orgId: row.org_id,
      role: row.role,
      createdAt: row.created_at,
      user: {
        email: row.user_email,
        name: row.user_name,
      },
    }));
  },

  async findById(id: string): Promise<Membership | null> {
    const result = await pool.query<MembershipRow>(
      "SELECT id, user_id, org_id, role, created_at FROM memberships WHERE id = $1",
      [id],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      orgId: row.org_id,
      role: row.role,
      createdAt: row.created_at,
    };
  },

  async updateRole(id: string, role: MemberRole): Promise<Membership | null> {
    const result = await pool.query<MembershipRow>(
      `UPDATE memberships
       SET role = $2
       WHERE id = $1
       RETURNING id, user_id, org_id, role, created_at`,
      [id, role],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      orgId: row.org_id,
      role: row.role,
      createdAt: row.created_at,
    };
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM memberships WHERE id = $1", [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  },

  async countOwnersByOrgId(orgId: string): Promise<number> {
    const result = await pool.query<{ count: string }>(
      "SELECT COUNT(*) as count FROM memberships WHERE org_id = $1 AND role = 'owner'",
      [orgId],
    );
    return parseInt(result.rows[0]?.count ?? "0", 10);
  },
};
