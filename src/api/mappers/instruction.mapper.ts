import type {
  InstructionDto,
  InstructionListItemDto,
  InstructionAssigneeDto,
  InstructionStatsDto,
  AttachmentDto,
} from '../dtos';
import type {
  Instruction,
  InstructionListItem,
  InstructionAssignee,
  InstructionStats,
  Attachment,
} from '@/types';
import { userMapper } from './user.mapper';
import { environmentMapper } from './environment.mapper';

/** Maps Instruction DTOs to domain types */
export const instructionMapper = {
  toDomain(dto: InstructionDto): Instruction {
    return {
      id: dto.id,
      environmentId: dto.environment_id,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDateType: dto.due_date_type ?? 'routine',
      dueDateFrom: dto.due_date_from ? new Date(dto.due_date_from) : null,
      dueDate: dto.due_date ? new Date(dto.due_date) : null,
      source: dto.source,
      createdBy: userMapper.summaryToDomain(dto.created_by),
      assignees: dto.assignees.map(instructionMapper.assigneeToDomain),
      tags: dto.tags.map(environmentMapper.tagToDomain),
      commentCount: dto.comment_count,
      attachmentCount: dto.attachment_count,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      completedAt: dto.completed_at ? new Date(dto.completed_at) : null,
      archived: dto.archived,
      isImportant: dto.is_important ?? false,
    };
  },

  listItemToDomain(dto: InstructionListItemDto): InstructionListItem {
    return {
      id: dto.id,
      environmentId: dto.environment_id,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDateType: dto.due_date_type ?? 'routine',
      dueDateFrom: dto.due_date_from ? new Date(dto.due_date_from) : null,
      dueDate: dto.due_date ? new Date(dto.due_date) : null,
      source: dto.source,
      assignees: dto.assignees.map(instructionMapper.assigneeToDomain),
      tags: dto.tags.map(environmentMapper.tagToDomain),
      commentCount: dto.comment_count,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      isImportant: dto.is_important ?? false,
    };
  },

  assigneeToDomain(dto: InstructionAssigneeDto): InstructionAssignee {
    return {
      id: dto.id,
      user: userMapper.summaryToDomain(dto.user),
      assignedAt: new Date(dto.assigned_at),
      assignedBy: dto.assigned_by
        ? userMapper.summaryToDomain(dto.assigned_by)
        : null,
      status: dto.status,
    };
  },

  statsToDomain(dto: InstructionStatsDto): InstructionStats {
    return {
      total: dto.total,
      open: dto.open,
      inProgress: dto.in_progress,
      completed: dto.completed,
      archived: dto.archived,
      overdue: dto.overdue,
      urgent: dto.urgent,
      dueSoon: dto.due_soon,
    };
  },

  attachmentToDomain(dto: AttachmentDto): Attachment {
    return {
      id: dto.id,
      instructionId: dto.instruction_id,
      fileName: dto.file_name,
      fileUrl: dto.file_url,
      fileSize: dto.file_size,
      mimeType: dto.mime_type,
      uploadedBy: userMapper.summaryToDomain(dto.uploaded_by),
      uploadedAt: new Date(dto.uploaded_at),
    };
  },
};
