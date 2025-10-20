interface NewBooking {
    id: string;
    createdAt: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    userId: string;
    propertyId: string;
}
interface Booking extends NewBooking {
    id: string;
}

type BookingListQuery = {
    limit?: number;
    offset?: number;
    q?: string;
    sort_by?: 'createdAt' | 'totalPrice';
};
