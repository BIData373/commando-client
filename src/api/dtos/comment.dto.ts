import { z } from 'zod';
import { userSummaryDtoSchema } from './user.dto';

/** Comment response DTO */
export const commentDtoSchema = z.object({
  id: z.string().uuid(),
  instruction_id: z.string().uuid(),
  user: userSummaryDtoSchema,
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  edited: z.boolean(),
});

/** Create comment request DTO */
export const createCommentDtoSchema = z.object({
  content: z.string().min(1).max(5000),
});

export type CommentDto = z.infer<typeof commentDtoSchema>;
export type CreateCommentDto = z.infer<typeof createCommentDtoSchema>;
