import { EventType } from '../enums/EventType';
import { Sex } from '../enums/Sex';

export interface IEventFilterOption<T> {
    value: T;
    eventCount: number;
}

export interface IEventFilterOptionsRequest {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    eventStartDate?: string;
    eventEndDate?: string;
    minPrice?: number;
    maxPrice?: number;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
    eventType?: EventType;
}

export interface IEventFilterOptions {
    eventTypes: IEventFilterOption<EventType>[];
    sexOptions: IEventFilterOption<Sex>[];
    priceRange?: {
        minPrice: number | null;
        maxPrice: number | null;
    };
    ageRange?: {
        minAge: number | null;
        maxAge: number | null;
    };
    dateRange?: {
        minDate: string | null;
        maxDate: string | null;
    };
}
