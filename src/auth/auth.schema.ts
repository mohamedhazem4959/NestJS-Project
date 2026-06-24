import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(50),
});

export const googleSignUpSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    googleId: z.string().min(1),
    accessToken: z.string().optional(),
});

export type signInDto = z.infer<typeof signInSchema>;
export type googleSignUpDto = z.infer<typeof googleSignUpSchema>;