import { Sex } from '../enums/Sex';

export interface IEventMapPinsParams {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    eventDate?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
}
