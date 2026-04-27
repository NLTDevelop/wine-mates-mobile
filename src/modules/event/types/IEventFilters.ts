import { Sex } from '@/entities/events/enums/Sex';

export interface IEventFilters {
    radiusKm?: number;
    eventDate?: string;
    language?: string;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
    minPrice?: number;
    maxPrice?: number;
}
