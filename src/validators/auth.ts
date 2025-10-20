import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const registerSchema: z.ZodType<RegisterBody> = z.object({
    email: z.email("Valid email is required"),
    password: z.string()
        .min(6,"Password has to be 6 chars long at least")
        .regex(/[A-Za-z]/, "Password has to. contain a letter")
        .regex(/[0-9]/, "Password has to contain a number")
});

export const registerValidator = zValidator("json", registerSchema)