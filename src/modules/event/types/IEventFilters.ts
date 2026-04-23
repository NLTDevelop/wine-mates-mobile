import { Sex } from '@/entities/events/enums/Sex';

export interface IEventFilters {
    radiusKm?: number;
    eventDate?: string;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
}
