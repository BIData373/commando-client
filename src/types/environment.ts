import type { MemberRole } from './common';
import type { UserSummary } from './user';

/** Core Environment type */
export interface Environment {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  memberCount: number;
  instructionCount: number;
}

/** Environment with member context (for the current user) */
export interface EnvironmentWithRole extends Environment {
  currentUserRole: MemberRole;
}

/** Environment member (user + role within an environment) */
export interface EnvironmentMember {
  id: string;
  environmentId: string;
  user: UserSummary;
  role: MemberRole;
  joinedAt: Date;
}

/** Tag within an environment */
export interface Tag {
  id: string;
  environmentId: string;
  name: string;
  color: string;
  createdAt: Date;
}

/** Responsible Group within an environment */
export interface ResponsibleGroup {
  id: string;
  environmentId: string;
  nickname: string;
  members: UserSummary[];
  createdAt: Date;
}
