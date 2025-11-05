import * as z from 'zod';
import { zValidator } from '@hono/zod-validator';
const propertySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    price_per_night: z.number().positive("Price per night must be positive"),
    availability: z.boolean(),
    images: z.array(z.url("Each image must be a valid URL")).optional().default(["https://placehold.co/600x400"]),
});
export const propertyValidator = zValidator("json", propertySchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
});
const partialPropertySchema = propertySchema.partial();
export const partialPropertyValidator = zValidator("json", partialPropertySchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
});
