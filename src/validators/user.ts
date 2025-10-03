import * as z from 'zod';
import { zValidator } from '@hono/zod-validator';

const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    isAdmin: z.boolean().optional()
});

export const userValidator = zValidator("json", userSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
    if (result.data.isAdmin === undefined) {
        result.data.isAdmin = false;
    }
});