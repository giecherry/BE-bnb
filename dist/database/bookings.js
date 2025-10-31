export const getBookings = async (sb, options) => {
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
    const query = sb
        .from('bookings')
        .insert({
        user_id: booking.userId,
        property_id: booking.propertyId,
        check_in_date: booking.checkInDate,
        check_out_date: booking.checkOutDate,
        total_price: booking.totalPrice,
    })
        .select()
        .single();
    const response = await query;
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response.data;
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
