export enum UserRole {
	ADMIN = "admin",
	VIEWER = "user",
}

/** Core User type */
export interface IUser {
	id: number;
	email: string;
	name: string;
	avatarUrl: string | null;
	role: UserRole;
	createdAt: string;
	updatedAt: string;
	lastLogin: string | null;
}

/** Minimal user info for display in lists, avatars, etc. */
export interface IUserSummary {
	id: number;
	name: string;
	email?: string;
	avatarUrl: string | null;
}

/** Create user request */
export interface ICreateUser {
	name: string;
	email: string;
	role: UserRole;
	avatarUrl?: string | null;
}

/** Update user request */
export interface IUpdateUser {
	name?: string;
	email?: string;
	role?: UserRole;
	avatarUrl?: string | null;
}
