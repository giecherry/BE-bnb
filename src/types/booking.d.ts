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