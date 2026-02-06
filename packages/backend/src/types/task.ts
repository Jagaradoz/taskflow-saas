export interface Task {
  id: string;
  orgId: string;
  createdBy: string | null;
  title: string;
  description: string | null;
  isDone: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskRow {
  id: string;
  org_id: string;
  created_by: string | null;
  title: string;
  description: string | null;
  is_done: boolean;
  is_pinned: boolean;
  created_at: Date;
  updated_at: Date;
}
