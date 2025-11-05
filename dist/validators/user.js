import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Valid email is required"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    role: z.enum(["user", "host", "admin"]).default("user"),
});
export const userValidator = zValidator("json", userSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
});
const loginSchema = z.object({
    email: z.email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
});
export const loginValidator = zValidator("json", loginSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
});
