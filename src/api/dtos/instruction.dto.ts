import { z } from 'zod';
import { userSummaryDtoSchema } from './user.dto';
import { tagDtoSchema } from './environment.dto';

/** Instruction assignee DTO */
export const instructionAssigneeDtoSchema = z.object({
  id: z.string().uuid(),
  user: userSummaryDtoSchema,
  assigned_at: z.string(),
  assigned_by: userSummaryDtoSchema.nullable(),
  status: z.enum(['open', 'in_progress', 'completed', 'archived']),
});

/** Full instruction response DTO */
export const instructionDtoSchema = z.object({
  id: z.string().uuid(),
  environment_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(['open', 'in_progress', 'completed', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date_type: z.enum(['routine', 'immediate', 'date']).default('routine'),
  due_date_from: z.string().nullable().default(null),
  due_date: z.string().nullable(),
  source: z.string().nullable(),
  created_by: userSummaryDtoSchema,
  assignees: z.array(instructionAssigneeDtoSchema),
  tags: z.array(tagDtoSchema),
  comment_count: z.number(),
  attachment_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  completed_at: z.string().nullable(),
  archived: z.boolean(),
  is_important: z.boolean().default(false),
});

/** Instruction list item DTO (lighter for tables) */
export const instructionListItemDtoSchema = z.object({
  id: z.string().uuid(),
  environment_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(['open', 'in_progress', 'completed', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date_type: z.enum(['routine', 'immediate', 'date']).default('routine'),
  due_date_from: z.string().nullable().default(null),
  due_date: z.string().nullable(),
  source: z.string().nullable(),
  assignees: z.array(instructionAssigneeDtoSchema),
  tags: z.array(tagDtoSchema),
  comment_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  is_important: z.boolean().default(false),
});

/** Create instruction request DTO */
export const createInstructionDtoSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(10000).optional(),
  status: z.enum(['open', 'in_progress', 'completed']).default('open'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date_type: z.enum(['routine', 'immediate', 'date']).default('routine').optional(),
  due_date_from: z.string().optional(),
  due_date: z.string().optional(),
  source: z.string().max(255).optional(),
  assignee_ids: z.array(z.string().uuid()).optional(),
  responsible_group_ids: z.array(z.string().uuid()).optional(),
  tag_ids: z.array(z.string().uuid()).optional(),
  is_important: z.boolean().optional(),
});

/** Update instruction request DTO */
export const updateInstructionDtoSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(10000).optional(),
  status: z.enum(['open', 'in_progress', 'completed', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  due_date_type: z.enum(['routine', 'immediate', 'date']).optional(),
  due_date_from: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  source: z.string().max(255).nullable().optional(),
  assignee_ids: z.array(z.string().uuid()).optional(),
  responsible_group_ids: z.array(z.string().uuid()).optional(),
  tag_ids: z.array(z.string().uuid()).optional(),
  is_important: z.boolean().optional(),
});

/** Instruction stats DTO */
export const instructionStatsDtoSchema = z.object({
  total: z.number(),
  open: z.number(),
  in_progress: z.number(),
  completed: z.number(),
  archived: z.number(),
  overdue: z.number(),
  urgent: z.number(),
  due_soon: z.number(),
});

/** Attachment DTO */
export const attachmentDtoSchema = z.object({
  id: z.string().uuid(),
  instruction_id: z.string().uuid(),
  file_name: z.string(),
  file_url: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  uploaded_by: userSummaryDtoSchema,
  uploaded_at: z.string(),
});

export type InstructionAssigneeDto = z.infer<typeof instructionAssigneeDtoSchema>;
export type InstructionDto = z.infer<typeof instructionDtoSchema>;
export type InstructionListItemDto = z.infer<typeof instructionListItemDtoSchema>;
export type CreateInstructionDto = z.infer<typeof createInstructionDtoSchema>;
export type UpdateInstructionDto = z.infer<typeof updateInstructionDtoSchema>;
export type InstructionStatsDto = z.infer<typeof instructionStatsDtoSchema>;
export type AttachmentDto = z.infer<typeof attachmentDtoSchema>;
