/** Core User type */
export interface IUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}

/** Minimal user info for display in lists, avatars, etc. */
export interface IUserSummary {
  id: string;
  name: string;
  email?: string;
  avatarUrl: string | null;
}
