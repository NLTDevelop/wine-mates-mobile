import { Sex } from '../enums/Sex';
import { TastingType } from '../enums/TastingType';

export interface IEventMapPinsParams {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    tastingType?: TastingType;
    eventDate?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
}
