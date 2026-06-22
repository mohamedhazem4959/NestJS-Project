import {z} from 'zod';

export const createPostSchema = z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(1).max(500),
    authorName: z.string().min(1).max(50),
});

export type createPostDto = z.infer<typeof createPostSchema>;
