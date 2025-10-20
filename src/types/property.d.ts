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

interface PropertyListQuery {
    q?: string;
    sort_by?: string;
    offset?: number;
    limit?: number;
}