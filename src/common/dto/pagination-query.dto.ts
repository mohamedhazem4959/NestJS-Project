import { z } from 'zod';

export const paginationQuerySchema = z.object({
    page: z.number().int().positive().min(1, { error: 'Page must be a positive integer' }).default(1).optional(),
    limit: z.number().int().positive().min(1, { error: 'Limit must be a positive integer' }).max(10, { error: 'Limit must not exceed 100' }).default(10).optional(),
});

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;