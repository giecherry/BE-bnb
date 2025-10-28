import { Hono } from 'hono';
import { requireAuth, optionalAuth, requireAdmin } from '../middleware/auth.js';
import * as bookingDb from '../database/bookings.js';
import { handleError } from '../utils/general.js';

const bookingsApp = new Hono();

bookingsApp.get('/', requireAdmin, async (c) => {
    const sb = c.get('supabase');
    const { q, sort_by, offset, limit } = c.req.query();

    try {
        const bookings = await bookingDb.getBookings(sb, { q, sort_by, offset: Number(offset), limit: Number(limit) });
        return c.json(bookings);
    } catch (error) {
        return handleError(error, 'Failed to fetch bookings', c);
    }
});

bookingsApp.get('/users/:userId', requireAuth, async (c) => {
    const sb = c.get('supabase');
    const userId = c.req.param('userId');

    try {
        const bookings = await bookingDb.getUserBookings(sb, userId);
        return c.json(bookings);
    } catch (error) {
        return handleError(error, `Failed to fetch user ${userId} bookings`, c);
    }
});

bookingsApp.get('/:id', requireAuth, async (c) => {
    const sb = c.get('supabase');
    const id = c.req.param('id');

    try {
        const booking = await bookingDb.getBookingById(sb, id);
        if (!booking) {
            return c.json({ error: 'Booking not found' }, 404);
        }
        return c.json(booking);
    } catch (error) {
        return handleError(error, 'Failed to fetch booking with ID ' + id, c);
    }
});

bookingsApp.post('/', requireAuth, async (c) => {
    const sb = c.get('supabase');
    const body = await c.req.json();

    try {
        const { userId, propertyId, checkInDate, checkOutDate, totalPrice } = body;

        if (!userId || !propertyId || !checkInDate || !checkOutDate || !totalPrice) {
            return c.json({ error: 'Missing required fields' }, 400);
        }

        const newBooking = await bookingDb.createBooking(sb, {
            userId,
            propertyId,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        return c.json(newBooking, 201);
    } catch (error) {
        return handleError(error, 'Failed to create booking', c);
    }
});

bookingsApp.patch('/:id', requireAuth, async (c) => {
    const sb = c.get('supabase');
    const id = c.req.param('id');
    const body = await c.req.json();

    try {
        const updatedBooking = await bookingDb.updateBooking(sb, id, body);
        if (!updatedBooking) {
            return c.json({ error: 'Booking not found' }, 404);
        }
        return c.json(updatedBooking);
    } catch (error) {
        return handleError(error, 'Failed to update booking with ID ' + id, c);
    }
});

bookingsApp.delete('/:id', requireAuth, async (c) => {
    const sb = c.get('supabase');
    const id = c.req.param('id');

    try {
        const deleted = await bookingDb.deleteBooking(sb, id);
        if (!deleted) {
            return c.json({ error: 'Booking not found' }, 404);
        }
        return c.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        return handleError(error, 'Failed to delete booking with ID ' + id, c);
    }
});

export default bookingsApp;