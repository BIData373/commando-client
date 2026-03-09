import { z } from 'zod';

/** Paginated response DTO schema */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
    total_pages: z.number(),
  });

/** Pagination query params DTO */
export const paginationParamsSchema = z.object({
  page: z.number().min(1).default(1),
  page_size: z.number().min(1).max(100).default(20),
});

/** Sort query params DTO */
export const sortParamsSchema = z.object({
  sort_by: z.string().optional(),
  sort_direction: z.enum(['asc', 'desc']).default('asc'),
});

export type PaginationParamsDto = z.infer<typeof paginationParamsSchema>;
export type SortParamsDto = z.infer<typeof sortParamsSchema>;
