import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

export const getBookings = async (sb: SupabaseClient) => {
    const query = sb.from("bookings").select("*");
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

export const createBooking = async (sb: SupabaseClient, booking: Omit<NewBooking, "id" | "createdAt">) => {
    const query = sb.from("bookings").insert(booking).select().single();
    const response: PostgrestSingleResponse<Booking> = await query;
    return response;
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