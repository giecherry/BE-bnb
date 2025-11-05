import * as z from 'zod';
import { zValidator } from '@hono/zod-validator';
const bookingSchema = z.object({
    check_in_date: z.string().min(1, "Check-in date is required"),
    check_out_date: z.string().min(1, "Check-out date is required"),
    property_id: z.string().min(1, "Property ID is required"),
}).refine((data) => {
    const checkIn = new Date(data.check_in_date);
    const checkOut = new Date(data.check_out_date);
    return checkOut > checkIn;
}, {
    message: "Check-out date must be after check-in date",
    path: ["check_out_date"]
});
export const bookingValidator = zValidator("json", bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
});
const partialBookingSchema = bookingSchema.partial().refine((data) => {
    if (data.check_in_date && data.check_out_date) {
        const checkIn = new Date(data.check_in_date);
        const checkOut = new Date(data.check_out_date);
        return checkOut > checkIn;
    }
    return true;
}, {
    message: "Check-out date must be after check-in date",
    path: ["check_out_date"]
});
export const partialBookingValidator = zValidator("json", partialBookingSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
});
