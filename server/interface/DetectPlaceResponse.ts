export class DetectPlaceResponse {
    name: string;
    description: string;
    city: string;
    images: string[];
    info: string[];
    location: {
        latitude: number;
        longitude: number;
    };
    restaurants: {
        name: string;
        description: string;
        rating: number;
        image: string | null;
    }[];
    activities: {
        name: string;
        description: string;
    }[];
    hotels: {
        name: string;
        description: string;
        stars: number;
        image: string | null;
    }[];

    constructor(data: Record<string, any>) {
        this.name = data.name;
        this.description = data.description;
        this.city = data.city;
        this.images = data.images;
        this.info = data.info;
        this.location = data.location;
        this.restaurants = data.restaurants;
        this.activities = data.activities;
        this.hotels = data.hotels;
    }
}