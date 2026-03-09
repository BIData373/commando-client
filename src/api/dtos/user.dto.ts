import { z } from 'zod';

/** User response DTO from API (snake_case) */
export const userDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  avatar_url: z.string().nullable(),
  role: z.enum(['admin', 'user']),
  created_at: z.string(),
  updated_at: z.string(),
  last_login: z.string().nullable(),
});

/** Minimal user DTO for embedded references */
export const userSummaryDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatar_url: z.string().nullable(),
});

export type UserDto = z.infer<typeof userDtoSchema>;
export type UserSummaryDto = z.infer<typeof userSummaryDtoSchema>;
