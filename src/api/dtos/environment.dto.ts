import { z } from 'zod';
import { userSummaryDtoSchema } from './user.dto';

/** Tag DTO */
export const tagDtoSchema = z.object({
  id: z.string().uuid(),
  environment_id: z.string().uuid(),
  name: z.string(),
  color: z.string(),
  created_at: z.string(),
});

/** Environment response DTO */
export const environmentDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  logo_url: z.string().nullable(),
  created_by: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  archived: z.boolean(),
  member_count: z.number(),
  instruction_count: z.number(),
});

/** Environment with current user role DTO */
export const environmentWithRoleDtoSchema = environmentDtoSchema.extend({
  current_user_role: z.enum(['manager', 'responsible']),
});

/** Environment member DTO */
export const environmentMemberDtoSchema = z.object({
  id: z.string().uuid(),
  environment_id: z.string().uuid(),
  user: userSummaryDtoSchema,
  role: z.enum(['manager', 'responsible']),
  joined_at: z.string(),
});

/** Responsible group DTO */
export const responsibleGroupDtoSchema = z.object({
  id: z.string().uuid(),
  environment_id: z.string().uuid(),
  nickname: z.string(),
  members: z.array(userSummaryDtoSchema),
  created_at: z.string(),
});

/** Create / update responsible group request DTO */
export const createResponsibleGroupDtoSchema = z.object({
  nickname: z.string().min(1).max(50),
  user_ids: z.array(z.string().uuid()).min(1),
});

/** Create environment request DTO */
export const createEnvironmentDtoSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
});

export type TagDto = z.infer<typeof tagDtoSchema>;
export type EnvironmentDto = z.infer<typeof environmentDtoSchema>;
export type EnvironmentWithRoleDto = z.infer<typeof environmentWithRoleDtoSchema>;
export type EnvironmentMemberDto = z.infer<typeof environmentMemberDtoSchema>;
export type CreateEnvironmentDto = z.infer<typeof createEnvironmentDtoSchema>;
export type ResponsibleGroupDto = z.infer<typeof responsibleGroupDtoSchema>;
export type CreateResponsibleGroupDto = z.infer<typeof createResponsibleGroupDtoSchema>;
