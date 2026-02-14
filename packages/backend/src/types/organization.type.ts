export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgRow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
