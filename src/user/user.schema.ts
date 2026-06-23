import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(50),
});

export type createUserDto = z.infer<typeof createUserSchema>;