import type { ActivityEventDto } from '../dtos';
import type { ActivityEvent } from '@/types';
import { userMapper } from './user.mapper';

/** Maps Activity DTOs to domain types */
export const activityMapper = {
  toDomain(dto: ActivityEventDto): ActivityEvent {
    return {
      id: dto.id,
      instructionId: dto.instruction_id,
      user: userMapper.summaryToDomain(dto.user),
      action: dto.action,
      metadata: {
        oldValue: dto.metadata.old_value,
        newValue: dto.metadata.new_value,
        targetUser: dto.metadata.target_user
          ? userMapper.summaryToDomain(dto.metadata.target_user)
          : undefined,
        tagName: dto.metadata.tag_name,
        fileName: dto.metadata.file_name,
        commentPreview: dto.metadata.comment_preview,
      },
      createdAt: new Date(dto.created_at),
    };
  },
};
