import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

export const getBookings = async (
    sb: SupabaseClient, options?: { q?: string; sort_by?: string; offset?: number; limit?: number }
) => {
    let query = sb.from("bookings").select("*");

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
    const query = sb.from("bookings").select("*").eq("id", id).single();
    const booking: PostgrestSingleResponse<Booking> = await query;
    return booking.data || null;
};

export const getUserBookings = async (sb: SupabaseClient, userId: string) => {
    const query = sb.from("bookings").select("*").eq("userId", userId);
    const bookings: PostgrestSingleResponse<Booking[]> = await query;
    return bookings.data || [];
};

export const createBooking = async (
    sb: SupabaseClient,
    booking: Omit<NewBooking, 'id' | 'createdAt'>
): Promise<Booking> => {
    const property = await sb.from('properties').select('price_per_night').eq('id', booking.propertyId).single();
    if (!property.data) {
        throw new Error('Property not found');
    }
    const pricePerNight = property.data.price_per_night;
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const stayLength = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
    const totalPrice = pricePerNight * stayLength;

    const query = sb
        .from('bookings')
        .insert({
            user_id: booking.userId,
            property_id: booking.propertyId,
            check_in_date: booking.checkInDate,
            check_out_date: booking.checkOutDate,
            total_price: totalPrice,
        })
        .select()
        .single();

    const response: PostgrestSingleResponse<Booking> = await query;

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

export const updateBooking = async (
    sb: SupabaseClient,
    id: string,
    booking: NewBooking) => {
    const query = sb
        .from("bookings")
        .update(booking)
        .eq("id", id)
        .select()
        .single();
    const response: PostgrestSingleResponse<Booking> = await query;
    return response;
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