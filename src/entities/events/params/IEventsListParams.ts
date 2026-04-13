import { Sex } from '../enums/Sex';

export interface IEventsListParams {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    offset: number;
    limit: number;
    eventDate?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
}
