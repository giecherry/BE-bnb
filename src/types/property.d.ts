interface NewProperty {
    id: string;
    name: string;
    description: string;
    location: string;
    pricePerNight: number;
    availability: boolean;
}

interface Property extends NewProperty {
    course_id: string;
}