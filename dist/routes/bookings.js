import { Hono } from 'hono';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as bookingDb from '../database/bookings.js';
import { handleError } from '../utils/general.js';
import { bookingValidator, partialBookingValidator } from '../validators/booking.js';
const bookingsApp = new Hono();
bookingsApp.get('/', requireRole(['admin']), async (c) => {
    const sb = c.get('supabase');
    const { q, sort_by, offset, limit } = c.req.query();
    try {
        const bookings = await bookingDb.getBookings(sb, { q, sort_by, offset: Number(offset), limit: Number(limit) });
        return c.json(bookings);
    }
    catch (error) {
        return handleError(error, 'Failed to fetch bookings', c);
    }
});
bookingsApp.get('/:userId', requireRole(['admin', 'user']), async (c) => {
    const sb = c.get('supabase');
    const user = c.get('user');
    const userId = c.req.param('userId');
    if (!user) {
        return c.json({ error: 'Unauthorized: User not found' }, 401);
    }
    try {
        if (user.role !== 'admin' && user.id !== userId) {
            return c.json({ error: 'Unauthorized access' }, 403);
        }
        const bookings = await bookingDb.getUserBookings(sb, userId);
        return c.json(bookings);
    }
    catch (error) {
        return handleError(error, `Failed to fetch user ${userId} bookings`, c);
    }
});
bookingsApp.get('/:id', requireRole(['admin', 'user', 'host']), async (c) => {
    const sb = c.get('supabase');
    const user = c.get('user');
    const id = c.req.param('id');
    try {
        const booking = await bookingDb.getBookingById(sb, id);
        if (!booking) {
            return c.json({ error: 'Booking not found' }, 404);
        }
        if (!user) {
            return c.json({ error: 'Unauthorized: User not found' }, 401);
        }
        const { data: property, error: propertyError } = await sb
            .from('properties')
            .select('user_id')
            .eq('id', booking.property_id)
            .single();
        if (propertyError || !property) {
            return c.json({ error: 'Property not found' }, 404);
        }
        if (user.role !== 'admin' &&
            user.id !== booking.user_id &&
            user.id !== property.user_id) {
            return c.json({ error: 'Unauthorized access' }, 403);
        }
        return c.json(booking);
    }
    catch (error) {
        return handleError(error, 'Failed to fetch booking with ID ' + id, c);
    }
});
bookingsApp.post('/', bookingValidator, requireAuth, async (c) => {
    const sb = c.get('supabase');
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Unauthorized: User not found' }, 401);
    }
    const body = await c.req.json();
    try {
        const { property_id, check_in_date, check_out_date } = body;
        if (!property_id || !check_in_date || !check_out_date) {
            return c.json({ error: 'Missing required fields' }, 400);
        }
        const { data: property, error: propertyError } = await sb
            .from('properties')
            .select('user_id, price_per_night')
            .eq('id', property_id)
            .single();
        if (propertyError || !property) {
            return c.json({ error: 'Property not found' }, 404);
        }
        if (property.user_id === user.id) {
            return c.json({ error: 'Hosts cannot book their own properties' }, 403);
        }
        const { data: overlappingBookings } = await sb
            .from('bookings')
            .select('id')
            .eq('property_id', property_id)
            .or(`and(check_in_date.lt.${check_out_date},check_out_date.gt.${check_in_date})`);
        if (overlappingBookings && overlappingBookings.length > 0) {
            return c.json({ error: 'Property is already booked for the selected dates' }, 409);
        }
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);
        const stayLength = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
        const totalPrice = property.price_per_night * stayLength;
        const newBooking = await bookingDb.createBooking(sb, {
            user_id: user.id,
            property_id: property_id,
            check_in_date: check_in_date,
            check_out_date: check_out_date,
            total_price: totalPrice,
        });
        return c.json(newBooking, 201);
    }
    catch (error) {
        return handleError(error, 'Failed to create booking', c);
    }
});
bookingsApp.patch('/:id', requireRole(['admin', 'user']), partialBookingValidator, async (c) => {
    const sb = c.get('supabase');
    const user = c.get('user');
    const id = c.req.param('id');
    const body = await c.req.json();
    if (!user) {
        return c.json({ error: 'Unauthorized: User not found' }, 401);
    }
    try {
        const existingBooking = await bookingDb.getBookingById(sb, id);
        if (!existingBooking) {
            return c.json({ error: 'Booking not found' }, 404);
        }
        if (user.role !== 'admin' && user.id !== existingBooking.user_id) {
            return c.json({ error: 'Unauthorized access' }, 403);
        }
        const { data: property, error: propertyError } = await sb
            .from('properties')
            .select('price_per_night')
            .eq('id', existingBooking.property_id)
            .single();
        if (propertyError || !property) {
            return c.json({ error: 'Property not found' }, 404);
        }
        let totalPrice = existingBooking.total_price;
        if (body.check_in_date && body.check_out_date) {
            const checkIn = new Date(body.check_in_date);
            const checkOut = new Date(body.check_out_date);
            const stayLength = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
            totalPrice = property.price_per_night * stayLength;
        }
        const updatedBooking = await bookingDb.updateBooking(sb, id, {
            ...body,
            total_price: totalPrice,
        });
        if (!updatedBooking) {
            return c.json({ error: 'Failed to update booking' }, 500);
        }
        return c.json(updatedBooking);
    }
    catch (error) {
        return handleError(error, 'Failed to update booking with ID ' + id, c);
    }
});
bookingsApp.delete('/:id', requireRole(['admin', 'user']), async (c) => {
    const sb = c.get('supabase');
    const user = c.get('user');
    const id = c.req.param('id');
    if (!user) {
        return c.json({ error: 'Unauthorized: User not found' }, 401);
    }
    try {
        const booking = await bookingDb.getBookingById(sb, id);
        if (!booking) {
            return c.json({ error: 'Booking not found' }, 404);
        }
        if (user.role !== 'admin' && user.id !== booking.user_id) {
            return c.json({ error: 'Unauthorized access' }, 403);
        }
        const deleted = await bookingDb.deleteBooking(sb, id);
        if (!deleted) {
            return c.json({ error: 'Failed to delete booking' }, 500);
        }
        return c.json({ message: 'Booking deleted successfully' });
    }
    catch (error) {
        return handleError(error, 'Failed to delete booking with ID ' + id, c);
    }
});
export default bookingsApp;
