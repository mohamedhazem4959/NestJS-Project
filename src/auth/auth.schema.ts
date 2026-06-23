import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(50),
});

export type signInDto = z.infer<typeof signInSchema>;