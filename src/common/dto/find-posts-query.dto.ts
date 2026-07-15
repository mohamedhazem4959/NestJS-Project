import { z } from 'zod';
import { paginationQuerySchema } from './pagination-query.dto';

export const findPostsQuerySchema = paginationQuerySchema.extend({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title must not be empty' })
    .max(100, { message: 'Title must be at most 100 characters' })
    .optional(),
});

export type FindPostsQueryDto = z.infer<typeof findPostsQuerySchema>;