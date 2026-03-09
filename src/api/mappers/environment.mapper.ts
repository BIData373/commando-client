import type {
  EnvironmentWithRoleDto,
  EnvironmentMemberDto,
  TagDto,
  ResponsibleGroupDto,
} from '../dtos';
import type { EnvironmentWithRole, EnvironmentMember, Tag, ResponsibleGroup } from '@/types';
import { userMapper } from './user.mapper';

/** Maps Environment DTOs to domain types */
export const environmentMapper = {
  toDomain(dto: EnvironmentWithRoleDto): EnvironmentWithRole {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      logoUrl: dto.logo_url,
      createdBy: dto.created_by,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      archived: dto.archived,
      memberCount: dto.member_count,
      instructionCount: dto.instruction_count,
      currentUserRole: dto.current_user_role,
    };
  },

  memberToDomain(dto: EnvironmentMemberDto): EnvironmentMember {
    return {
      id: dto.id,
      environmentId: dto.environment_id,
      user: userMapper.summaryToDomain(dto.user),
      role: dto.role,
      joinedAt: new Date(dto.joined_at),
    };
  },

  tagToDomain(dto: TagDto): Tag {
    return {
      id: dto.id,
      environmentId: dto.environment_id,
      name: dto.name,
      color: dto.color,
      createdAt: new Date(dto.created_at),
    };
  },

  responsibleGroupToDomain(dto: ResponsibleGroupDto): ResponsibleGroup {
    return {
      id: dto.id,
      environmentId: dto.environment_id,
      nickname: dto.nickname,
      members: dto.members.map(userMapper.summaryToDomain),
      createdAt: new Date(dto.created_at),
    };
  },
};
