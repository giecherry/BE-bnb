interface NewBooking {
    id: string;
    created_at: string;
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    user_id: string;
    property_id: string;
}
interface Booking extends NewBooking {
    id: string;
}

type BookingListQuery = {
    limit?: number;
    offset?: number;
    q?: string;
    sort_by?: 'created_at' | 'total_price';
};
