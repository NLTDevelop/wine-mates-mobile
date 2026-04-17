import { Sex } from '../enums/Sex';
import { EventType } from '../enums/EventType';

export interface IEventMapPinsParams {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    eventType?: EventType;
    eventDate?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
}
