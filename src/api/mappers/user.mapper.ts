import type { UserDto, UserSummaryDto } from '../dtos';
import type { User, UserSummary } from '@/types';

/** Maps User DTOs to domain types */
export const userMapper = {
  toDomain(dto: UserDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      avatarUrl: dto.avatar_url,
      role: dto.role,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      lastLogin: dto.last_login ? new Date(dto.last_login) : null,
    };
  },

  summaryToDomain(dto: UserSummaryDto): UserSummary {
    return {
      id: dto.id,
      name: dto.name,
      avatarUrl: dto.avatar_url,
    };
  },
};
