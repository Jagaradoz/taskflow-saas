// Local
import { pool } from "../config/db.js";
import type {
  MembershipRequest,
  MembershipRequestType,
  MembershipRequestStatus,
  MembershipRequestRow,
  MembershipRequestWithUserRow,
  MembershipRequestWithUser,
  CreateMembershipRequestData,
} from "../types/membership-request.js";

function mapRowToMembershipRequest(
  row: MembershipRequestRow,
): MembershipRequest {
  return {
    id: row.id,
    orgId: row.org_id,
    type: row.type,
    invitedUserId: row.invited_user_id,
    invitedBy: row.invited_by,
    requesterId: row.requester_id,
    role: row.role,
    status: row.status,
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at,
    resolvedBy: row.resolved_by,
  };
}

function mapRowToMembershipRequestWithUser(
  row: MembershipRequestWithUserRow,
): MembershipRequestWithUser {
  const result: MembershipRequestWithUser = {
    ...mapRowToMembershipRequest(row),
    user: {
      name: row.user_name,
      email: row.user_email,
    },
  };

  if (row.inviter_name) {
    result.inviter = { name: row.inviter_name };
  }

  if (row.org_name && row.org_slug) {
    result.org = { name: row.org_name, slug: row.org_slug };
  }

  return result;
}

export const membershipRequestRepository = {
  async findById(id: string): Promise<MembershipRequest | null> {
    const result = await pool.query<MembershipRequestRow>(
      `SELECT id, org_id, type, invited_user_id, invited_by, requester_id,
              role, status, message, created_at, updated_at, resolved_at, resolved_by
       FROM membership_requests
       WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (!row) return null;

    return mapRowToMembershipRequest(row);
  },

  async findByOrgId(
    orgId: string,
    type?: MembershipRequestType,
    status?: MembershipRequestStatus,
  ): Promise<MembershipRequestWithUser[]> {
    let query = `
      SELECT mr.id, mr.org_id, mr.type, mr.invited_user_id, mr.invited_by, mr.requester_id,
             mr.role, mr.status, mr.message, mr.created_at, mr.updated_at, mr.resolved_at, mr.resolved_by,
             u.name as user_name, u.email as user_email,
             inviter.name as inviter_name,
             NULL as org_name, NULL as org_slug
      FROM membership_requests mr
      LEFT JOIN users u ON u.id = COALESCE(mr.invited_user_id, mr.requester_id)
      LEFT JOIN users inviter ON inviter.id = mr.invited_by
      WHERE mr.org_id = $1
    `;
    const params: (string | undefined)[] = [orgId];
    let paramIndex = 2;

    if (type) {
      query += ` AND mr.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (status) {
      query += ` AND mr.status = $${paramIndex}`;
      params.push(status);
    }

    query += ` ORDER BY mr.created_at DESC`;

    const result = await pool.query<MembershipRequestWithUserRow>(
      query,
      params,
    );
    return result.rows.map(mapRowToMembershipRequestWithUser);
  },

  async findByInvitedUserId(
    userId: string,
    status?: MembershipRequestStatus,
  ): Promise<MembershipRequestWithUser[]> {
    let query = `
      SELECT mr.id, mr.org_id, mr.type, mr.invited_user_id, mr.invited_by, mr.requester_id,
             mr.role, mr.status, mr.message, mr.created_at, mr.updated_at, mr.resolved_at, mr.resolved_by,
             u.name as user_name, u.email as user_email,
             inviter.name as inviter_name,
             o.name as org_name, o.slug as org_slug
      FROM membership_requests mr
      JOIN users u ON u.id = mr.invited_user_id
      LEFT JOIN users inviter ON inviter.id = mr.invited_by
      JOIN organizations o ON o.id = mr.org_id
      WHERE mr.invited_user_id = $1 AND mr.type = 'invite'
    `;
    const params: (string | undefined)[] = [userId];

    if (status) {
      query += ` AND mr.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY mr.created_at DESC`;

    const result = await pool.query<MembershipRequestWithUserRow>(
      query,
      params,
    );
    return result.rows.map(mapRowToMembershipRequestWithUser);
  },

  async findByRequesterId(
    userId: string,
    status?: MembershipRequestStatus,
  ): Promise<MembershipRequestWithUser[]> {
    let query = `
      SELECT mr.id, mr.org_id, mr.type, mr.invited_user_id, mr.invited_by, mr.requester_id,
             mr.role, mr.status, mr.message, mr.created_at, mr.updated_at, mr.resolved_at, mr.resolved_by,
             u.name as user_name, u.email as user_email,
             NULL as inviter_name,
             o.name as org_name, o.slug as org_slug
      FROM membership_requests mr
      JOIN users u ON u.id = mr.requester_id
      JOIN organizations o ON o.id = mr.org_id
      WHERE mr.requester_id = $1 AND mr.type = 'request'
    `;
    const params: (string | undefined)[] = [userId];

    if (status) {
      query += ` AND mr.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY mr.created_at DESC`;

    const result = await pool.query<MembershipRequestWithUserRow>(
      query,
      params,
    );
    return result.rows.map(mapRowToMembershipRequestWithUser);
  },

  async create(data: CreateMembershipRequestData): Promise<MembershipRequest> {
    const result = await pool.query<MembershipRequestRow>(
      `INSERT INTO membership_requests (org_id, type, invited_user_id, invited_by, requester_id, role, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, org_id, type, invited_user_id, invited_by, requester_id,
                 role, status, message, created_at, updated_at, resolved_at, resolved_by`,
      [
        data.orgId,
        data.type,
        data.invitedUserId || null,
        data.invitedBy || null,
        data.requesterId || null,
        data.role,
        data.message || null,
      ],
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error("Failed to create membership request");
    }

    return mapRowToMembershipRequest(row);
  },

  async updateStatus(
    id: string,
    status: MembershipRequestStatus,
    resolvedBy: string,
  ): Promise<MembershipRequest | null> {
    const result = await pool.query<MembershipRequestRow>(
      `UPDATE membership_requests
       SET status = $2, resolved_by = $3, resolved_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING id, org_id, type, invited_user_id, invited_by, requester_id,
                 role, status, message, created_at, updated_at, resolved_at, resolved_by`,
      [id, status, resolvedBy],
    );

    const row = result.rows[0];
    if (!row) return null;

    return mapRowToMembershipRequest(row);
  },

  async checkDuplicatePendingInvite(
    orgId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS(
         SELECT 1 FROM membership_requests
         WHERE org_id = $1 AND invited_user_id = $2 AND type = 'invite' AND status = 'pending'
       ) as exists`,
      [orgId, userId],
    );
    return result.rows[0]?.exists ?? false;
  },

  async checkDuplicatePendingRequest(
    orgId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS(
         SELECT 1 FROM membership_requests
         WHERE org_id = $1 AND requester_id = $2 AND type = 'request' AND status = 'pending'
       ) as exists`,
      [orgId, userId],
    );
    return result.rows[0]?.exists ?? false;
  },
};
