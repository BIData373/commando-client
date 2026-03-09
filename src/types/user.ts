/** Core User type */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

/** Minimal user info for display in lists, avatars, etc. */
export interface UserSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
}
