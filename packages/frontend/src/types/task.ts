/**
 * Task type definition
 */
export interface Task {
  id: string;
  orgId: string;
  createdBy: string;
  creatorName: string;
  title: string;
  description?: string;
  isDone: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
