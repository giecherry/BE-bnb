export const getBookings = async (sb) => {
    const query = sb.from("bookings").select("*");
    const bookings = await query;
    return bookings.data || [];
};
export const getBookingById = async (sb, id) => {
    const query = sb.from("bookings").select("*").eq("id", id).single();
    const booking = await query;
    return booking.data || null;
};
export const getUserBookings = async (sb, userId) => {
    const query = sb.from("bookings").select("*").eq("userId", userId);
    const bookings = await query;
    return bookings.data || [];
};
export const createBooking = async (sb, booking) => {
    const query = sb.from("bookings").insert(booking).select().single();
    const response = await query;
    return response;
};
export const updateBooking = async (sb, id, booking) => {
    const query = sb
        .from("bookings")
        .update(booking)
        .eq("id", id)
        .select()
        .single();
    const response = await query;
    return response;
};
export const deleteBooking = async (sb, id) => {
    const query = sb
        .from("bookings")
        .delete()
        .eq("id", id)
        .select()
        .single();
    const response = await query;
    return response;
};
