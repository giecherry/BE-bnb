import * as z from 'zod';
import { zValidator } from '@hono/zod-validator';
const bookingSchema = z.object({
    checkInDate: z.string().min(1, "Check-in date is required"),
    checkOutDate: z.string().min(1, "Check-out date is required"),
    propertyId: z.string().min(1, "Property ID is required"),
    totalPrice: z.number().min(0, "Total price must be a positive number")
}).refine((data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
}, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"]
});
export const bookingValidator = zValidator("json", bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
});
