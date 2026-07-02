import { Sex } from '@/entities/events/enums/Sex';

export interface IEventFilters {
    radiusKm?: number;
    eventStartDate?: string;
    eventEndDate?: string;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
    minPrice?: number;
    maxPrice?: number;
}
