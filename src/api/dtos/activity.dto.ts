import { z } from 'zod';
import { userSummaryDtoSchema } from './user.dto';

/** Activity metadata DTO */
export const activityMetadataDtoSchema = z.object({
  old_value: z.string().optional(),
  new_value: z.string().optional(),
  target_user: userSummaryDtoSchema.optional(),
  tag_name: z.string().optional(),
  file_name: z.string().optional(),
  comment_preview: z.string().optional(),
});

/** Activity event response DTO */
export const activityEventDtoSchema = z.object({
  id: z.string().uuid(),
  instruction_id: z.string().uuid(),
  user: userSummaryDtoSchema,
  action: z.enum([
    'created',
    'status_changed',
    'assigned',
    'unassigned',
    'commented',
    'edited',
    'tag_added',
    'tag_removed',
    'due_date_changed',
    'priority_changed',
    'attachment_added',
    'attachment_removed',
    'archived',
    'restored',
  ]),
  metadata: activityMetadataDtoSchema,
  created_at: z.string(),
});

export type ActivityMetadataDto = z.infer<typeof activityMetadataDtoSchema>;
export type ActivityEventDto = z.infer<typeof activityEventDtoSchema>;
