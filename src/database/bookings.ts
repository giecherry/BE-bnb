import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

export const getBookings = async (
    sb: SupabaseClient, options?: { q?: string; sort_by?: string; offset?: number; limit?: number }
) => {
    let query = sb.from("bookings").select("*, user:user_id(*), property:property_id(*)");

    if (options?.q) {
        query = query.ilike("name", `%${options.q}%`);
    }
    if (options?.sort_by) {
        query = query.order(options.sort_by, { ascending: true });
    }
    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    if (options?.limit) {
        query = query.limit(options.limit);
    }

    const bookings: PostgrestSingleResponse<Booking[]> = await query;
    return bookings.data || [];
};

export const getBookingById = async (sb: SupabaseClient, id: string) => {
    const query = sb
        .from("bookings")
        .select("*, user:user_id(*), property:property_id(*)")
        .eq("id", id)
        .single();

    const booking: PostgrestSingleResponse<Booking> = await query;
    return booking.data || null;
};

export const getUserBookings = async (sb: SupabaseClient, userId: string) => {
    const query = sb
        .from("bookings")
        .select("*, user:user_id(*), property:property_id(*)")
        .eq("user_id", userId);

    const bookings: PostgrestSingleResponse<Booking[]> = await query;
    return bookings.data || [];
};

export const createBooking = async (
    sb: SupabaseClient,
    booking: Omit<NewBooking, 'id' | 'created_at'>
): Promise<NewBooking> => {
    if (!booking.user_id || !booking.property_id || !booking.check_in_date || !booking.check_out_date || !booking.total_price) {
        throw new Error('Missing required fields for booking creation');
    }

    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    if (checkOut <= checkIn) {
        throw new Error('Check-out date must be after check-in date');
    }

    const query = sb
        .from('bookings')
        .insert({
            user_id: booking.user_id,
            property_id: booking.property_id,
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date,
            total_price: booking.total_price,
        })
        .select()
        .single();

    const response: PostgrestSingleResponse<NewBooking> = await query;

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

export const updateBooking = async (
    sb: SupabaseClient,
    id: string,
    booking: Partial<NewBooking>
): Promise<Booking | null> => {
    const query = sb
        .from("bookings")
        .update(booking)
        .eq("id", id)
        .select()
        .single();

    const response: PostgrestSingleResponse<Booking> = await query;

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data || null;
};

export const deleteBooking = async (sb: SupabaseClient, id: string) => {
    const query = sb
        .from("bookings")
        .delete()
        .eq("id", id)
        .select()
        .single();
    const response: PostgrestSingleResponse<Booking> = await query;
    return response;
};