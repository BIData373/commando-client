import type { MemberRole } from './common';
import type { IUserSummary } from './user';

/** Core Environment type */
export interface IEnvironment {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  memberCount: number;
  instructionCount: number;
}

/** Environment with member context (for the current user) */
export interface IEnvironmentWithRole extends IEnvironment {
  currentUserRole: MemberRole;
}

/** Environment member (user + role within an environment) */
export interface IEnvironmentMember {
  id: string;
  environmentId: string;
  user: IUserSummary;
  role: MemberRole;
  joinedAt: string;
}

/** Tag within an environment */
export interface ITag {
  id: string;
  environmentId: string;
  name: string;
  color: string;
  createdAt: string;
}

/** Responsible Group within an environment */
export interface IResponsibleGroup {
  id: string;
  environmentId: string;
  nickname: string;
  members: IUserSummary[];
  createdAt: string;
}

/** Create environment request */
export interface ICreateEnvironment {
  name: string;
  description?: string;
}

/** Create / update responsible group request */
export interface ICreateResponsibleGroup {
  nickname: string;
  userIds: string[];
}
