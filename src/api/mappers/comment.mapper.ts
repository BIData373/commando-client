import type { CommentDto } from '../dtos';
import type { Comment } from '@/types';
import { userMapper } from './user.mapper';

/** Maps Comment DTOs to domain types */
export const commentMapper = {
  toDomain(dto: CommentDto): Comment {
    return {
      id: dto.id,
      instructionId: dto.instruction_id,
      user: userMapper.summaryToDomain(dto.user),
      content: dto.content,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      edited: dto.edited,
    };
  },
};
