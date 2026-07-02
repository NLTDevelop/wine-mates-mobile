import { Sex } from '../enums/Sex';
import { EventType } from '../enums/EventType';

export interface IEventsListParams {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    offset: number;
    limit: number;
    eventStartDate?: string;
    eventEndDate?: string;
    eventType?: EventType;
    minPrice?: number;
    maxPrice?: number;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
}
