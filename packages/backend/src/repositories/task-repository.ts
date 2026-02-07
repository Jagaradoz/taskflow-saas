// Local
import { pool } from "../config/db.js";
import { AppError } from "../utils/errors.js";
import type { Task, TaskRow } from "../types/task.js";

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    orgId: row.org_id,
    createdBy: row.created_by,
    creatorName: row.creator_name,
    title: row.title,
    description: row.description,
    isDone: row.is_done,
    isPinned: row.is_pinned,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const taskRepository = {
  async findByOrgId(orgId: string): Promise<Task[]> {
    const result = await pool.query<TaskRow>(
      `SELECT t.id, t.org_id, t.created_by, u.name AS creator_name,
              t.title, t.description, t.is_done, t.is_pinned, t.created_at, t.updated_at
       FROM tasks t
       LEFT JOIN users u ON u.id = t.created_by
       WHERE t.org_id = $1
       ORDER BY t.is_pinned DESC, t.created_at DESC`,
      [orgId],
    );

    return result.rows.map(rowToTask);
  },

  async findById(id: string, orgId: string): Promise<Task | null> {
    const result = await pool.query<TaskRow>(
      `SELECT t.id, t.org_id, t.created_by, u.name AS creator_name,
              t.title, t.description, t.is_done, t.is_pinned, t.created_at, t.updated_at
       FROM tasks t
       LEFT JOIN users u ON u.id = t.created_by
       WHERE t.id = $1 AND t.org_id = $2`,
      [id, orgId],
    );

    const row = result.rows[0];
    if (!row) return null;

    return rowToTask(row);
  },

  async create(data: {
    orgId: string;
    createdBy: string;
    title: string;
    description?: string | null;
  }): Promise<Task> {
    const result = await pool.query<TaskRow>(
      `WITH new_task AS (
         INSERT INTO tasks (org_id, created_by, title, description)
         VALUES ($1, $2, $3, $4)
         RETURNING id, org_id, created_by, title, description, is_done, is_pinned, created_at, updated_at
       )
       SELECT nt.*, u.name AS creator_name
       FROM new_task nt
       LEFT JOIN users u ON u.id = nt.created_by`,
      [data.orgId, data.createdBy, data.title, data.description ?? null],
    );

    const row = result.rows[0];
    if (!row) {
      throw new AppError("Failed to create task");
    }
    return rowToTask(row);
  },

  async update(
    id: string,
    orgId: string,
    data: Partial<Pick<Task, "title" | "description" | "isDone" | "isPinned">>,
  ): Promise<Task | null> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.isDone !== undefined) {
      updates.push(`is_done = $${paramIndex++}`);
      values.push(data.isDone);
    }
    if (data.isPinned !== undefined) {
      updates.push(`is_pinned = $${paramIndex++}`);
      values.push(data.isPinned);
    }

    if (updates.length === 0) {
      return this.findById(id, orgId);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id, orgId);

    const result = await pool.query<TaskRow>(
      `WITH updated_task AS (
         UPDATE tasks
         SET ${updates.join(", ")}
         WHERE id = $${paramIndex++} AND org_id = $${paramIndex}
         RETURNING id, org_id, created_by, title, description, is_done, is_pinned, created_at, updated_at
       )
       SELECT ut.*, u.name AS creator_name
       FROM updated_task ut
       LEFT JOIN users u ON u.id = ut.created_by`,
      values,
    );

    const row = result.rows[0];
    if (!row) return null;

    return rowToTask(row);
  },

  async delete(id: string, orgId: string): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND org_id = $2",
      [id, orgId],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
